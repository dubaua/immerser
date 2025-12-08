const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const rootDir = path.join(__dirname, '..');
const packageJSON = require(path.join(rootDir, 'package.json'));

const bundle = fs.readFileSync(path.join(rootDir, 'dist', 'immerser.min.js'), 'utf8');

const bungleSize = (Math.round(gzipSize.sync(bundle) / 1000 * 100) / 100).toString();

const version = packageJSON.version;

function replacer(content) {
  let result = content;
  const thisYear = new Date().getFullYear();
  result = result.replace(/%%BUNDLESIZE%%/g, bungleSize);
  result = result.replace(/%%VERSION%%/g, version);
  result = result.replace(/%%THIS_YEAR%%/g, thisYear);
  return result;
}

function replaceInFile(filePath, replacer) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = replacer(content);
  fs.writeFileSync(filePath, result);
}

replaceInFile(path.join(rootDir, 'README.md'), replacer);
replaceInFile(path.join(rootDir, 'docs', 'index.html'), replacer);
replaceInFile(path.join(rootDir, 'docs', 'ru.html'), replacer);
