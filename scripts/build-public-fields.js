const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const TurndownService = require('turndown');
const en = require('../i18n/en.js');

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const rootDir = path.join(__dirname, '..');
const immerserPath = path.join(rootDir, 'src', 'immerser.ts');
const htmlOutPath = path.join(rootDir, 'example', 'content', 'code', 'public-fields.html');
const mdOutPath = path.join(rootDir, 'example', 'content', 'code', 'public-fields.md');

function translationKey(name) {
  return `public-field-${name}`;
}

function requireTranslation(name) {
  const key = translationKey(name);
  const value = en[key];
  if (!value) {
    throw new Error(`Missing translation for public field "${name}" (expected key "${key}" in i18n/en.js)`);
  }
  return value;
}

function isPublic(member) {
  const modifiers = member.modifiers || [];
  return !modifiers.some(
    (modifier) =>
      modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
  );
}

function memberKind(member) {
  if (ts.isMethodDeclaration(member)) return 'method';
  if (ts.isGetAccessorDeclaration(member)) return 'getter';
  if (ts.isSetAccessorDeclaration(member)) return 'setter';
  if (ts.isPropertyDeclaration(member)) return 'property';
  return 'unknown';
}

function getPublicMembers() {
  const src = fs.readFileSync(immerserPath, 'utf8');
  const sourceFile = ts.createSourceFile(immerserPath, src, ts.ScriptTarget.Latest, true);
  const members = [];

  sourceFile.forEachChild((node) => {
    if (ts.isClassDeclaration(node) && node.name?.text === 'Immerser') {
      node.members.forEach((member) => {
        if (ts.isConstructorDeclaration(member)) return;
        if (!isPublic(member)) return;
        if (!member.name || !ts.isIdentifier(member.name)) return;
        const name = member.name.text;
        const kind = memberKind(member);

        members.push({ name, kind });
      });
    }
  });

  return members;
}

function buildMarkdown(members) {
  const rows = members.map(({ name, kind }) => {
    const desc = turndown
      .turndown(requireTranslation(name))
      .replace(/\s+/g, ' ')
      .replace(/\|/g, '\\|')
      .trim();
    return `| ${name} | \`${kind}\` | ${desc} |`;
  });

  return ['| name | kind | description |', '| - | - | - |', rows.join('\n'), ''].join('\n');
}

function buildHtml(members) {
  const rows = members.map(({ name, kind }) => {
    requireTranslation(name);
    return [
      '    <tr>',
      `      <td>${name}</td>`,
      `      <td class="token keyword">${kind}</td>`,
      `      <td><%= getTranslation('${translationKey(name)}') %></td>`,
      '    </tr>',
    ].join('\n');
  });

  return [
    '<table>',
    '  <thead>',
    '    <tr>',
    `      <th class="token property"><%= getTranslation('public-field-name') %></th>`,
    `      <th class="token property"><%= getTranslation('type') %></th>`,
    `      <th class="token property"><%= getTranslation('description') %></th>`,
    '    </tr>',
    '  </thead>',
    '  <tbody>',
    rows.join('\n'),
    '  </tbody>',
    '</table>',
    '',
  ].join('\n');
}

function main() {
  const members = getPublicMembers();

  const md = buildMarkdown(members);
  const html = buildHtml(members);

  fs.writeFileSync(mdOutPath, md);
  fs.writeFileSync(htmlOutPath, html);
  console.log(`Built public fields:\n- ${mdOutPath}\n- ${htmlOutPath}`);
}

main();
