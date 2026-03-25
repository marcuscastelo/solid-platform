import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const PACKAGES_DIR = path.resolve('packages')

function run(command, options = {}) {
  return execSync(command, {
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  }).trim()
}

function tagExists(tag) {
  try {
    run(`git rev-parse --verify "${tag}"`)
    return true
  } catch {
    return false
  }
}

function getPackages() {
  return fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const createdTags = []

for (const dirName of getPackages()) {
  const packageJsonPath = path.join(PACKAGES_DIR, dirName, 'package.json')
  if (!fs.existsSync(packageJsonPath)) continue

  const pkg = readJson(packageJsonPath)
  if (pkg.private) continue

  const unscopedName = String(pkg.name).includes('/')
    ? pkg.name.split('/')[1]
    : pkg.name

  const version = pkg.version
  const tag = `${unscopedName}/v${version}`

  if (tagExists(tag)) {
    console.log(`skip existing tag: ${tag}`)
    continue
  }

  console.log(`create tag: ${tag}`)
  run(`git tag "${tag}"`)
  createdTags.push(tag)
}

if (createdTags.length === 0) {
  console.log('no new tags to push')
  process.exit(0)
}

console.log(`pushing ${createdTags.length} tag(s)...`)
execSync(`git push origin ${createdTags.map((tag) => `"${tag}"`).join(' ')}`, {
  stdio: 'inherit',
})