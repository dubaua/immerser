const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
const en = require('../i18n/en.js');

const turndownService = new TurndownService();
const rootDir = path.join(__dirname, '..');

function getTranslationFromTemplate(fileContent) {
  return fileContent.replace(/<%= getTranslation\('(.*)'\) %>/gm, (_, capture) =>
    Object.prototype.hasOwnProperty.call(en, capture) ? en[capture] : 'TRANSLATION_NOT_FOUND!',
  );
}

const markupCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'markup.html'), 'utf8'),
);
const styleCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'styles.css'), 'utf8'),
);
const initializationCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'initialization.js'), 'utf8'),
);
const optionsTable = fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'table.md'), 'utf8');
const publicFieldsTable = fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'public-fields.md'), 'utf8');
const cloningEventListenersCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'cloning-event-listeners.html'), 'utf8'),
);
const handleCloneHoverCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'handle-clone-hover.css'), 'utf8'),
);
const handleDOMChangeCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'handle-dom-change.js'), 'utf8'),
);
const externalScrollEngineCode = getTranslationFromTemplate(
  fs.readFileSync(path.join(rootDir, 'example', 'content', 'code', 'external-scroll-engine.js'), 'utf8'),
);

const readmeContent = `# ${en['readme-title']}

${turndownService.turndown(en['why-immerser-content'])}

## ${en['terms-title']}

${turndownService.turndown(en['terms-content'])}

# ${en['menu-link-how-to-use']}

## ${en['install-title']}

${turndownService.turndown(en['install-npm-label'])}

\`\`\`shell
npm install immerser
\`\`\`

${turndownService.turndown(en['install-yarn-label'])}

\`\`\`shell
yarn add immerser
\`\`\`

${turndownService.turndown(en['install-browser-label'])}

\`\`\`html
<script src="https://unpkg.com/immerser@%%VERSION%%/dist/immerser.min.js"></script>
\`\`\`

## ${en['prepare-your-markup-title']}

${turndownService.turndown(en['prepare-your-markup-content'])}

\`\`\`html
${markupCode}
\`\`\`

## ${en['apply-styles-title']}

${turndownService.turndown(en['apply-styles-content'])}

\`\`\`css
${styleCode}
\`\`\`

## ${en['initialize-immerser-title']}

${turndownService.turndown(en['initialize-immerser-content'])}

\`\`\`js
${initializationCode}
\`\`\`

# ${en['how-it-works-title']}

${turndownService.turndown(en['how-it-works-content'])}

# ${en['options-title']}

${turndownService.turndown(en['options-content'])}

${optionsTable}

# ${en['public-fields-title']}

${publicFieldsTable}

# ${en['menu-link-recipes']}

## ${en['cloning-event-listeners-title']}

${turndownService.turndown(en['cloning-event-listeners-content'])}

\`\`\`html
${cloningEventListenersCode}
\`\`\`

## ${en['handle-clone-hover-title']}

${turndownService.turndown(en['handle-clone-hover-content'])}

\`\`\`css
${handleCloneHoverCode}
\`\`\`

## ${en['handle-dom-change-title']}

${turndownService.turndown(en['handle-dom-change-content'])}

\`\`\`js
${handleDOMChangeCode}
\`\`\`

## ${en['external-scroll-engine-title']}

${turndownService.turndown(en['external-scroll-engine-content'])}

\`\`\`js
${externalScrollEngineCode}
\`\`\`
`;

fs.writeFileSync(path.join(rootDir, 'README.md'), readmeContent);
