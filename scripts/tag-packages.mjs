import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const PACKAGES_DIR = './packages'

const packages = fs.readdirSync(PACKAGES_DIR)

for (const pkg of packages) {
  const pkgPath = path.join(PACKAGES_DIR, pkg, 'package.json')

  if (!fs.existsSync(pkgPath)) continue

  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  if (pkgJson.private) continue

  const name = pkgJson.name.split('/')[1] // remove scope
  const version = pkgJson.version

  const tag = `${name}/v${version}`

  try {
    execSync(`git rev-parse ${tag}`, { stdio: 'ignore' })
    console.log(`⏭ tag already exists: ${tag}`)
  } catch {
    console.log(`🏷 creating tag: ${tag}`)
    execSync(`git tag ${tag}`)
  }
}

console.log('🚀 pushing tags...')
execSync('git push --tags', { stdio: 'inherit' })