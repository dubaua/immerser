const fs = require('fs');
const TurndownService = require('turndown');
const en = require('./i18n/en.js');

const turndownService = new TurndownService();

function getTranslationFromTemplate(fileContent) {
  return fileContent.replace(/<%= getTranslation\('(.*)'\) %>/gm, (_, capture) =>
    Object.prototype.hasOwnProperty.call(en, capture) ? en[capture] : 'TRANSLATION_NOT_FOUND!',
  );
}

const markupCode = getTranslationFromTemplate(fs.readFileSync('./example/content/code/markup.html', 'utf8'));
const styleCode = getTranslationFromTemplate(fs.readFileSync('./example/content/code/styles.css', 'utf8'));
const initializationCode = getTranslationFromTemplate(
  fs.readFileSync('./example/content/code/initialization.js', 'utf8'),
);
const optionsTable = fs.readFileSync('./example/content/code/table.md', 'utf8');
const clonningEventListenersCode = getTranslationFromTemplate(
  fs.readFileSync('./example/content/code/clonning-event-listeners.html', 'utf8'),
);
const handleCloneHovereCode = getTranslationFromTemplate(
  fs.readFileSync('./example/content/code/handle-clone-hover.css', 'utf8'),
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

# ${en['menu-link-possibilities']}

## ${en['clonning-event-listeners-title']}

${turndownService.turndown(en['clonning-event-listeners-content'])}

\`\`\`html
${clonningEventListenersCode}
\`\`\`

## ${en['handle-clone-hover-title']}

${turndownService.turndown(en['handle-clone-hover-content'])}

\`\`\`css
${handleCloneHovereCode}
\`\`\`
`;

fs.writeFileSync('README.md', readmeContent);
