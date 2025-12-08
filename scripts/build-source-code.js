const fs = require('fs');
const path = require('path');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'example', 'index.html');
const blockRE =
  /(<!--\s*@build-source-code\s+([^\s]+)(?:\s+([^\s]+))?\s*-->)([\s\S]*?)(<!--\s*@end-build-source-code\s*-->)/g;

const extensionToLanguage = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  md: 'markdown',
};

const fallbackLanguage = 'clike';

function detectLanguage(filePath) {
  const ext = path.extname(filePath).replace('.', '').toLowerCase();
  return extensionToLanguage[ext] || fallbackLanguage;
}

function renderSource(sourcePath, { skipPrism = false } = {}) {
  const absolutePath = path.resolve(path.dirname(indexPath), sourcePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');
  if (skipPrism) {
    return raw;
  }
  const language = detectLanguage(absolutePath);

  // Load language grammar on demand; Prism will noop if it is already loaded.
  try {
    loadLanguages([language]);
  } catch (error) {
    console.warn(`Could not load Prism language "${language}", falling back to "${fallbackLanguage}".`, error.message);
  }

  const grammar = Prism.languages[language] || Prism.languages[fallbackLanguage];
  let highlighted = Prism.highlight(raw, grammar, language);

  // Do not escape this EJS marker inside HTML comments (docs expectation).
  // Restore unescaped EJS markers that Prism encoded (both `<% ... %>` and `<%-`/`<%=` variants).
  highlighted = highlighted.replace(/&lt;%([-=]?)([\s\S]*?)(?:%>|%&gt;)/g, (_m, sigil, inner) => {
    const trimmed = inner.trim();
    return `<%${sigil}${trimmed}%>`;
  });

  return `<pre><code class="language-${language}">${highlighted}</code></pre>`;
}

function buildSourceCode() {
  const html = fs.readFileSync(indexPath, 'utf8');
  let replacements = 0;

  const nextHtml = html.replace(blockRE, (match, startComment, sourcePath, flagStr, _content, endComment) => {
    replacements += 1;
    const flags = (flagStr || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const skipPrism = flags.includes('raw') || flags.includes('plain') || flags.includes('no-prism');

    const codeBlock = renderSource(sourcePath, { skipPrism });

    return `${startComment}\n${codeBlock}\n${endComment}`;
  });

  if (replacements === 0) {
    console.warn('No @build-source-code blocks found.');
    return;
  }

  fs.writeFileSync(indexPath, nextHtml, 'utf8');
  console.log(`Replaced ${replacements} @build-source-code block(s) in ${indexPath}`);
}

buildSourceCode();
