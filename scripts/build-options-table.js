const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
const ts = require('typescript');
const en = require('../i18n/en.js');

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const rootDir = path.join(__dirname, '..');
const htmlOutPath = path.join(rootDir, 'example', 'content', 'code', 'table.html');
const mdOutPath = path.join(rootDir, 'example', 'content', 'code', 'table.md');
const optionsPath = path.join(rootDir, 'src', 'options.ts');
const typeScriptModuleCache = new Map();

function translationKey(optionName) {
  return `option-${optionName}`;
}

function requireTranslation(optionName) {
  const key = translationKey(optionName);
  const value = en[key];
  if (!value) {
    throw new Error(`Missing translation for option "${optionName}" (expected key "${key}" in i18n/en.js)`);
  }
  return value;
}

function loadTypeScriptModule(modulePath) {
  if (typeScriptModuleCache.has(modulePath)) {
    return typeScriptModuleCache.get(modulePath).exports;
  }

  const src = fs.readFileSync(modulePath, 'utf8');
  const transpiled = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    fileName: modulePath,
    reportDiagnostics: true,
  });
  if (transpiled.diagnostics.length > 0) {
    const diagnostics = transpiled.diagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      .join('\n');
    throw new Error(`Could not transpile ${modulePath}:\n${diagnostics}`);
  }
  const moduleInstance = { exports: {} };
  typeScriptModuleCache.set(modulePath, moduleInstance);

  const localRequire = (request) => {
    if (!request.startsWith('.')) {
      return require(request);
    }

    const resolvedPath = path.resolve(path.dirname(modulePath), request);
    const typeScriptPath = path.extname(resolvedPath) ? resolvedPath : `${resolvedPath}.ts`;
    if (path.extname(typeScriptPath) === '.ts' && fs.existsSync(typeScriptPath)) {
      return loadTypeScriptModule(typeScriptPath);
    }
    return require(resolvedPath);
  };

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', transpiled.outputText);
  fn(moduleInstance.exports, localRequire, moduleInstance, modulePath, path.dirname(modulePath));

  return moduleInstance.exports;
}

function loadOptionConfig() {
  const optionConfig = loadTypeScriptModule(optionsPath).OptionConfig;
  if (!optionConfig || typeof optionConfig !== 'object' || Array.isArray(optionConfig)) {
    throw new Error('OptionConfig export not found in src/options.ts');
  }
  if (Object.keys(optionConfig).length === 0) {
    throw new Error('OptionConfig does not contain any options');
  }
  return optionConfig;
}

const OptionConfig = loadOptionConfig();

function inferType(optionName, config) {
  const value = config.default;
  if (optionName === 'on') return 'object';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (value !== null && typeof value === 'object') return 'object';
  if (value === null && optionName.startsWith('on')) return 'function';
  if (typeof value === 'function') return 'function';
  return 'unknown';
}

function formatDefaultForHtml(type, value) {
  switch (type) {
    case 'array':
      return '<td class="token punctuation">[]</td>';
    case 'object':
      return '<td class="token punctuation">{}</td>';
    case 'boolean':
      return `<td class="token boolean">${value}</td>`;
    case 'number':
      return `<td class="token number">${value}</td>`;
    case 'string':
      return `<td class="token string nowrap">${value}</td>`;
    case 'function':
      return '<td class="token keyword">null</td>';
    default:
      return `<td class="token keyword">${value === null ? 'null' : String(value)}</td>`;
  }
}

function formatDefaultForMarkdown(type, value) {
  switch (type) {
    case 'array':
      return '`[]`';
    case 'object':
      return '`{}`';
    case 'boolean':
    case 'number':
      return `\`${value}\``;
    case 'string':
      return `\`${value}\``;
    case 'function':
      return '`null`';
    default:
      return `\`${value === null ? 'null' : String(value)}\``;
  }
}

function getDescriptionMarkdown(optionName) {
  const raw = requireTranslation(optionName);
  const md = turndown.turndown(raw);
  return md.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
}

function buildHtml() {
  const rows = Object.entries(OptionConfig).map(([name, config]) => {
    requireTranslation(name);
    const type = inferType(name, config);
    const defaultCell = formatDefaultForHtml(type, config.default);
    return [
      '    <tr>',
      `      <td>${name}</td>`,
      `      <td class="token keyword">${type}</td>`,
      `      ${defaultCell}`,
      `      <td><%= getTranslation('${translationKey(name)}') %></td>`,
      '    </tr>',
    ].join('\n');
  });

  return [
    '<table>',
    '  <thead>',
    '    <tr>',
    '      <th class="token property"><%= getTranslation(\'option\') %></th>',
    '      <th class="token property"><%= getTranslation(\'type\') %></th>',
    '      <th class="token property"><%= getTranslation(\'default\') %></th>',
    '      <th class="token property"><%= getTranslation(\'description\') %></th>',
    '    </tr>',
    '  </thead>',
    '  <tbody>',
    rows.join('\n'),
    '  </tbody>',
    '</table>',
    '',
  ].join('\n');
}

function buildMarkdown() {
  const rows = Object.entries(OptionConfig).map(([name, config]) => {
    const type = inferType(name, config);
    const def = formatDefaultForMarkdown(type, config.default);
    const desc = getDescriptionMarkdown(name);
    return `| ${name} | \`${type}\` | ${def} | ${desc} |`;
  });

  return ['| option | type | default | description |', '| - | - | - | - |', rows.join('\n'), ''].join('\n');
}

function main() {
  const html = buildHtml();
  const md = buildMarkdown();

  fs.writeFileSync(htmlOutPath, html);
  fs.writeFileSync(mdOutPath, md);
  console.log(`Built tables:\n- ${htmlOutPath}\n- ${mdOutPath}`);
}

main();
