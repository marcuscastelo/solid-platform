#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import crypto from 'node:crypto'

const ROOT = process.cwd()
const PACKAGES_DIR = path.join(ROOT, 'packages')
const CHANGESET_DIR = path.join(ROOT, '.changeset')
const DEFAULT_SCOPE_MODE = 'head' // 'head' | 'main' | custom via --since

function run(command) {
  return execSync(command, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function safeRun(command) {
  try {
    return run(command)
  } catch {
    return ''
  }
}

function parseArgs(argv) {
  const args = {
    since: null,
    message: null,
    yes: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--since') {
      args.since = argv[i + 1] ?? null
      i++
      continue
    }

    if (arg === '--message') {
      args.message = argv[i + 1] ?? null
      i++
      continue
    }

    if (arg === '--yes') {
      args.yes = true
      continue
    }
  }

  return args
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getPackageDirs() {
  if (!fs.existsSync(PACKAGES_DIR)) return []

  return fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function getPackages() {
  const dirs = getPackageDirs()
  const packages = []

  for (const dirName of dirs) {
    const packageJsonPath = path.join(PACKAGES_DIR, dirName, 'package.json')
    if (!fs.existsSync(packageJsonPath)) continue

    const pkg = readJson(packageJsonPath)
    packages.push({
      dirName,
      dirPath: path.join(PACKAGES_DIR, dirName),
      packageJsonPath,
      name: pkg.name,
      version: pkg.version,
      private: Boolean(pkg.private),
      dependencies: pkg.dependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
      peerDependencies: pkg.peerDependencies ?? {},
      optionalDependencies: pkg.optionalDependencies ?? {},
    })
  }

  return packages
}

function buildPackageMaps(packages) {
  const byDir = new Map()
  const byName = new Map()

  for (const pkg of packages) {
    byDir.set(pkg.dirName, pkg)
    byName.set(pkg.name, pkg)
  }

  return { byDir, byName }
}

function buildReverseInternalDependencyGraph(packages, byName) {
  const reverse = new Map()

  for (const pkg of packages) {
    reverse.set(pkg.name, new Set())
  }

  for (const pkg of packages) {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies,
    }

    for (const depName of Object.keys(allDeps)) {
      if (!byName.has(depName)) continue
      reverse.get(depName).add(pkg.name)
    }
  }

  return reverse
}

function resolveDiffRange(sinceArg) {
  if (sinceArg) {
    return `${sinceArg}...HEAD`
  }

  if (DEFAULT_SCOPE_MODE === 'main') {
    return 'origin/main...HEAD'
  }

  return 'HEAD~1...HEAD'
}

function getChangedFiles(diffRange) {
  const output = safeRun(`git diff --name-only ${diffRange}`)
  if (!output) return []
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function mapChangedFilesToPackages(changedFiles, byDir) {
  const directlyChangedPackageNames = new Set()
  const globalChanges = []

  for (const file of changedFiles) {
    const normalized = file.replace(/\\/g, '/')
    const match = normalized.match(/^packages\/([^/]+)\/(.+)$/)

    if (match) {
      const dirName = match[1]
      const pkg = byDir.get(dirName)
      if (pkg) {
        directlyChangedPackageNames.add(pkg.name)
        continue
      }
    }

    globalChanges.push(normalized)
  }

  return {
    directlyChangedPackageNames,
    globalChanges,
  }
}

function expandAffectedPackages(seedNames, reverseGraph) {
  const affected = new Set(seedNames)
  const queue = [...seedNames]

  while (queue.length > 0) {
    const current = queue.shift()
    const dependents = reverseGraph.get(current) ?? new Set()

    for (const dependent of dependents) {
      if (affected.has(dependent)) continue
      affected.add(dependent)
      queue.push(dependent)
    }
  }

  return affected
}

function relativeImpactType(pkgName, directlyChangedSet) {
  return directlyChangedSet.has(pkgName) ? 'direct' : 'dependent'
}

function unscopedName(packageName) {
  if (!packageName.includes('/')) return packageName
  return packageName.split('/')[1]
}

function printSummary(packagesByName, directlyChangedSet, affectedSet, globalChanges) {
  const affected = [...affectedSet].map((name) => packagesByName.get(name)).filter(Boolean)

  console.log('\nAffected packages:\n')

  for (const pkg of affected) {
    const impact = relativeImpactType(pkg.name, directlyChangedSet)
    console.log(`- ${pkg.name} [${impact}]`)
  }

  if (globalChanges.length > 0) {
    console.log('\nGlobal/unmapped changed files:\n')
    for (const file of globalChanges) {
      console.log(`- ${file}`)
    }
  }

  console.log('')
}

async function askChoice(rl, prompt, allowed, defaultValue) {
  const allowedDisplay = allowed.join('/')
  const suffix = defaultValue ? ` [default: ${defaultValue}]` : ''
  const answer = (await rl.question(`${prompt} (${allowedDisplay})${suffix}: `)).trim()

  if (!answer && defaultValue) return defaultValue

  if (allowed.includes(answer)) return answer

  console.log(`Invalid choice: ${answer}`)
  return askChoice(rl, prompt, allowed, defaultValue)
}

async function askBumps(affectedPackages, directlyChangedSet, yesMode) {
  const rl = createInterface({ input, output })
  const result = new Map()

  try {
    for (const pkg of affectedPackages) {
      if (pkg.private) {
        console.log(`skip private package: ${pkg.name}`)
        continue
      }

      const direct = directlyChangedSet.has(pkg.name)

      if (yesMode) {
        result.set(pkg.name, direct ? 'patch' : 'patch')
        continue
      }

      if (direct) {
        const bump = await askChoice(
          rl,
          `Bump for ${pkg.name} (directly changed)`,
          ['patch', 'minor', 'major', 'none'],
          'patch',
        )
        if (bump !== 'none') result.set(pkg.name, bump)
      } else {
        const bump = await askChoice(
          rl,
          `Bump for ${pkg.name} (affected by internal dependency)`,
          ['none', 'patch', 'minor', 'major'],
          'patch',
        )
        if (bump !== 'none') result.set(pkg.name, bump)
      }
    }

    return result
  } finally {
    rl.close()
  }
}

async function maybeIncludeGlobalChanges(packages, selectedBumps, globalChanges, yesMode) {
  if (globalChanges.length === 0) return selectedBumps

  console.log('There are changed files outside packages/*.')
  if (yesMode) return selectedBumps

  const rl = createInterface({ input, output })

  try {
    const answer = await askChoice(
      rl,
      'Do you want to add extra packages manually because of global changes?',
      ['y', 'n'],
      'n',
    )

    if (answer === 'n') return selectedBumps

    const publicPackages = packages.filter((pkg) => !pkg.private)

    console.log('\nAvailable public packages:')
    publicPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`)
    })

    const rawIndexes = (await rl.question(
      '\nEnter package numbers separated by commas (or empty to skip): ',
    )).trim()

    if (!rawIndexes) return selectedBumps

    const indexes = rawIndexes
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= publicPackages.length)

    for (const index of indexes) {
      const pkg = publicPackages[index - 1]
      const bump = await askChoice(
        rl,
        `Bump for ${pkg.name} (manually selected from global changes)`,
        ['patch', 'minor', 'major', 'none'],
        'patch',
      )
      if (bump !== 'none') {
        selectedBumps.set(pkg.name, bump)
      }
    }

    return selectedBumps
  } finally {
    rl.close()
  }
}

function createChangesetFrontmatter(selectedBumps) {
  const entries = [...selectedBumps.entries()].sort(([a], [b]) => a.localeCompare(b))
  return [
    '---',
    ...entries.map(([pkgName, bump]) => `"${pkgName}": ${bump}`),
    '---',
  ].join('\n')
}

function slug() {
  return crypto.randomBytes(6).toString('hex')
}

function writeChangesetFile(frontmatter, message) {
  ensureDir(CHANGESET_DIR)
  const fileName = `${slug()}.md`
  const filePath = path.join(CHANGESET_DIR, fileName)

  const content = `${frontmatter}\n\n${message.trim()}\n`
  fs.writeFileSync(filePath, content, 'utf8')

  return filePath
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const diffRange = resolveDiffRange(args.since)

  const packages = getPackages()
  const { byDir, byName } = buildPackageMaps(packages)
  const reverseGraph = buildReverseInternalDependencyGraph(packages, byName)

  const changedFiles = getChangedFiles(diffRange)

  if (changedFiles.length === 0) {
    console.log(`No changed files found for diff range: ${diffRange}`)
    process.exit(0)
  }

  const {
    directlyChangedPackageNames,
    globalChanges,
  } = mapChangedFilesToPackages(changedFiles, byDir)

  const affectedPackageNames = expandAffectedPackages(directlyChangedPackageNames, reverseGraph)

  if (affectedPackageNames.size === 0 && globalChanges.length === 0) {
    console.log('No affected packages found.')
    process.exit(0)
  }

  printSummary(byName, directlyChangedPackageNames, affectedPackageNames, globalChanges)

  const affectedPackages = [...affectedPackageNames]
    .map((name) => byName.get(name))
    .filter(Boolean)
    .sort((a, b) => {
      const aDirect = directlyChangedPackageNames.has(a.name) ? 0 : 1
      const bDirect = directlyChangedPackageNames.has(b.name) ? 0 : 1
      if (aDirect !== bDirect) return aDirect - bDirect
      return a.name.localeCompare(b.name)
    })

  let selectedBumps = await askBumps(
    affectedPackages,
    directlyChangedPackageNames,
    args.yes,
  )

  selectedBumps = await maybeIncludeGlobalChanges(
    packages,
    selectedBumps,
    globalChanges,
    args.yes,
  )

  if (selectedBumps.size === 0) {
    console.log('No packages selected for changeset.')
    process.exit(0)
  }

  const defaultMessage =
    args.message ??
    `Release updates for ${[...selectedBumps.keys()].map(unscopedName).join(', ')}.`

  const frontmatter = createChangesetFrontmatter(selectedBumps)
  const filePath = writeChangesetFile(frontmatter, defaultMessage)

  console.log('\nCreated changeset:')
  console.log(path.relative(ROOT, filePath))
  console.log('\nFrontmatter:\n')
  console.log(frontmatter)
  console.log(`\nMessage:\n${defaultMessage}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})