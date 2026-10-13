// Builds ../www/index.html: one self-contained file (React, CSS, photos all inlined).
// Usage: npm install && npm run build:web
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const here = __dirname;
const srcDir = path.join(here, 'src');
const order = ['1-data.js', '2-ui.jsx', '3-shell.jsx', '4-pages.jsx', '5-app.jsx'];
const code = order.map((f) => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n');

const out = ts.transpileModule(code, {
  fileName: 'app.jsx',
  reportDiagnostics: true,
  compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2019, allowJs: true },
});
const errors = (out.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  errors.forEach((d) => console.error('Build error:', ts.flattenDiagnosticMessageText(d.messageText, '\n')));
  process.exit(1);
}

const imgs = {};
const assetDir = path.join(here, 'assets');
for (const f of fs.readdirSync(assetDir)) {
  imgs[f.replace(/\.jpg$/, '')] = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(assetDir, f)).toString('base64');
}
const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const react = fs.readFileSync(path.join(here, 'vendor', 'react-bundle.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const app = out.outputText.replace(/<\/script/gi, '<\\/script');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0a0908">
<title>Chami's House of Food</title>
<meta name="description" content="Chami's House of Food: beef burgers, chicken burgers, wings, tenders and loaded fries. Browse the menu and send your order on WhatsApp.">
<meta property="og:title" content="Chami's House of Food">
<meta property="og:description" content="Great Food. Great Experience. Burgers, chicken and appetizers.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&family=Kaushan+Script&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&family=Kaushan+Script&display=swap"></noscript>
<style>
html, body { margin: 0; }
img { max-width: 100%; }
[hidden] { display: none !important; }
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>(function(){${react}
})();</script>
<script>
const IMG = ${JSON.stringify(imgs)};
${app}
</script>
</body>
</html>
`;

const target = path.join(here, '..', 'www', 'index.html');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, html);
console.log('Wrote', target, (html.length / 1024).toFixed(0) + ' KB');
