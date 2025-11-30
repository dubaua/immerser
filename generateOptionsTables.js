const fs = require('fs');
const kindOf = require('kind-of');
const TurndownService = require('turndown');
const en = require('./i18n/en.js');

require('@babel/register')({
  extensions: ['.ts', '.js'],
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
});
const { OPTION_CONFIG } = require('./src/options.ts');

const turndownService = new TurndownService();

function getClassNames(type) {
  switch (type.toLowerCase()) {
    case 'array':
    case 'object':
      return 'punctuation';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string nowrap';
    case 'function':
    case 'null':
    case 'undefined':
      return 'keyword';
  }
}

const options = Object.keys(OPTION_CONFIG).map((optionName) => {
  let defaultValue = OPTION_CONFIG[optionName].default;
  let type = kindOf(defaultValue);
  if (type === 'null' && optionName.startsWith('on')) {
    type = 'function';
  }
  if (type === 'array') {
    defaultValue = '[]';
  }
  return {
    optionName,
    type,
    defaultValue,
  };
});

const HTMLRowsMarkup = options.map(({ optionName, type, defaultValue }) => {
  return `    <tr>
      <td>${optionName}</td>
      <td class="token keyword">${type}</td>
      <td class="token ${getClassNames(type)}">${defaultValue}</td>
      <td><%= getTranslation('option-${optionName}') %></td>
    </tr>`;
});

const HTMLTableMarkup = `<table>
  <thead>
    <tr>
      <th class="token property"><%= getTranslation('option') %></th>
      <th class="token property"><%= getTranslation('type') %></th>
      <th class="token property"><%= getTranslation('default') %></th>
      <th class="token property"><%= getTranslation('description') %></th>
    </tr>
  </thead>
  <tbody>
${HTMLRowsMarkup.join('\n')}
  </tbody>
</table>
`;

fs.writeFileSync('./example/content/code/table.html', HTMLTableMarkup);

const markdownTable = `| option | type | default | description |
| - | - | - | - |
${options
  .map(
    ({ optionName, type, defaultValue }) =>
      `| ${optionName} | \`${type}\` | \`${defaultValue}\` | ${turndownService.turndown(en['option-' + optionName])} |`,
  )
  .join('\n')}
`;

fs.writeFileSync('./example/content/code/table.md', markdownTable);
