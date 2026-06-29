const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const TurndownService = require('turndown');
const en = require('../i18n/en.js');

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const rootDir = path.join(__dirname, '..');
const typesPath = path.join(rootDir, 'src', 'types.ts');
const htmlOutPath = path.join(rootDir, 'example', 'content', 'code', 'event-table.html');
const mdOutPath = path.join(rootDir, 'example', 'content', 'code', 'event-table.md');

function translationKey(eventName) {
  return `event-${eventName}`;
}

function requireTranslation(eventName) {
  const key = translationKey(eventName);
  const value = en[key];
  if (!value) {
    throw new Error(`Missing translation for event "${eventName}" (expected key "${key}" in i18n/en.js)`);
  }
  return value;
}

function normalizeType(typeStr) {
  return typeStr.replace(/import\([^)]+\)\./g, '').replace(/"/g, "'");
}

function getEventName(member, sourceFile, checker) {
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) {
    return member.name.text;
  }
  if (ts.isComputedPropertyName(member.name)) {
    const type = checker.getTypeAtLocation(member.name.expression);
    if (type.isStringLiteral()) {
      return type.value;
    }
  }
  return member.name.getText(sourceFile);
}

function getEventDefinitions() {
  const program = ts.createProgram([typesPath], {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ESNext,
  });
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(typesPath);
  if (!sourceFile) {
    throw new Error(`Could not read ${typesPath}`);
  }
  if (sourceFile.parseDiagnostics.length > 0) {
    const diagnostics = sourceFile.parseDiagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      .join('\n');
    throw new Error(`Could not parse ${typesPath}:\n${diagnostics}`);
  }

  let handlerAlias = null;
  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'HandlerByEventName') {
      handlerAlias = node;
    }
  });

  if (!handlerAlias || !handlerAlias.type || !ts.isTypeLiteralNode(handlerAlias.type)) {
    throw new Error('HandlerByEventName type alias not found in src/types.ts');
  }

  const events = handlerAlias.type.members.filter(ts.isPropertySignature).map((member) => {
    const name = getEventName(member, sourceFile, checker);
    const type = checker.getTypeAtLocation(member);
    const signature = type.getCallSignatures()[0];
    if (!signature) {
      throw new Error(`Event "${name}" does not have a callable handler type`);
    }
    const parameters = signature.getParameters().map((paramSymbol) => {
      const decl = paramSymbol.valueDeclaration || paramSymbol.declarations?.[0];
      const paramType = checker.getTypeOfSymbolAtLocation(paramSymbol, decl ?? member);
      return {
        name: paramSymbol.getName(),
        type: normalizeType(
          checker.typeToString(
            paramType,
            decl,
            ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType,
          ),
        ),
      };
    });

    return { name, parameters };
  });

  if (events.length === 0) {
    throw new Error('HandlerByEventName does not contain any events');
  }

  return events;
}

function formatArgsHtml(parameters) {
  if (parameters.length === 0) {
    return '<td class="token keyword">void</td>';
  }

  const parts = parameters.map(
    ({ name, type }) =>
      `<span class="token parameter">${name}</span><span class="token operator">:</span> <span class="token class-name">${type}</span>`,
  );
  return `<td class="nowrap">${parts.join(', ')}</td>`;
}

function formatArgsMarkdown(parameters) {
  if (parameters.length === 0) {
    return '`void`';
  }
  return parameters.map(({ name, type }) => `\`${name}: ${type.replace(/\|/g, '\\|')}\``).join('<br>');
}

function getDescriptionMarkdown(eventName) {
  const raw = requireTranslation(eventName);
  const md = turndown.turndown(raw);
  return md.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
}

function buildHtml(events) {
  const rows = events.map(({ name, parameters }) => {
    requireTranslation(name);
    const argsCell = formatArgsHtml(parameters);
    return [
      '    <tr>',
      `      <td>${name}</td>`,
      `      ${argsCell}`,
      `      <td><%= getTranslation('${translationKey(name)}') %></td>`,
      '    </tr>',
    ].join('\n');
  });

  return [
    '<table>',
    '  <thead>',
    '    <tr>',
    `      <th class="token property"><%= getTranslation('event') %></th>`,
    `      <th class="token property"><%= getTranslation('arguments') %></th>`,
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

function buildMarkdown(events) {
  const rows = events.map(({ name, parameters }) => {
    const args = formatArgsMarkdown(parameters);
    const desc = getDescriptionMarkdown(name);
    return `| ${name} | ${args} | ${desc} |`;
  });

  return ['| event | arguments | description |', '| - | - | - |', rows.join('\n'), ''].join('\n');
}

function main() {
  const events = getEventDefinitions();
  const html = buildHtml(events);
  const md = buildMarkdown(events);

  fs.writeFileSync(htmlOutPath, html);
  fs.writeFileSync(mdOutPath, md);
  console.log(`Built event tables:\n- ${htmlOutPath}\n- ${mdOutPath}`);
}

main();
