const fs = require('fs')
const pkg = require(process.cwd() + '/package.json')

let copyright = `Copyright (c) ${pkg.author ? pkg.author.name || pkg.author : ''}`
try {
    const licenseFile = fs.readFileSync(process.cwd() + '/LICENSE', { encoding: 'utf8' })
    const result = licenseFile.match(/^copy.*$/gim)
    if (result && result[0]) {
        copyright = result[0]
    }
} catch (e) {}

const defaultBanner = `
    ${copyright}
    name: ${pkg.name}
    license: ${pkg.license}
    author: ${pkg.author ? pkg.author.name || pkg.author : ''}
    repository: ${pkg.repository.url}
    version: ${pkg.version}`

module.exports = defaultBanner
