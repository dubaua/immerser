const fs = require('fs');
const gzipSize = require('gzip-size');
const package = require('./package.json');

const bundle = fs.readFileSync('./dist/immerser.min.js', 'utf8');

const bungleSize = (Math.round(gzipSize.sync(bundle) / 1000 * 100) / 100).toString();

const version = package.version;

function replacer(content) {
  let result = content;
  result = result.replace(/%%BUNDLESIZE%%/g, bungleSize);
  result = result.replace(/%%VERSION%%/g, version);
  return result;
}

function replaceInFile(path, replacer) {
  const content = fs.readFileSync(path, 'utf8');
  const result = replacer(content);
  fs.writeFileSync(path, result);
}

replaceInFile('./README.md', replacer);
replaceInFile('./docs/index.html', replacer);
replaceInFile('./docs/ru.html', replacer);