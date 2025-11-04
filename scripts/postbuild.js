
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const docsDir = path.join(__dirname, '..', 'docs');
const srcStatic = path.join(buildDir, 'static');
const destStatic = path.join(docsDir, 'static');

if (!fs.existsSync(buildDir)) {
  console.error('Build directory not found. Run `npm run build` first.');
  process.exit(1);
}

// Clean docs/static
fs.rmSync(destStatic, { recursive: true, force: true });
fs.mkdirSync(path.join(destStatic, 'js'), { recursive: true });
fs.mkdirSync(path.join(destStatic, 'css'), { recursive: true });

// Copy entire static directory (hashed files)
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}
copyDir(srcStatic, destStatic);

// Create stable filenames by duplicating the hashed main bundle(s)
const manifestPath = path.join(buildDir, 'asset-manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const jsFiles = Object.values(manifest.files).filter((p) => p.endsWith('.js'));
  const cssFiles = Object.values(manifest.files).filter((p) => p.endsWith('.css'));

  const mainJs = jsFiles.find((p) => p.includes('/static/js/main'));
  const mainCss = cssFiles.find((p) => p.includes('/static/css/main'));

  function copyStable(relPath, stableTarget) {
    if (!relPath) return;
    const srcPath = path.join(buildDir, relPath.replace(/^\//, ''));
    const destPath = path.join(docsDir, stableTarget);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`Created ${stableTarget}`);
  }

  copyStable(mainJs, 'static/js/main.js');
  copyStable(mainCss, 'static/css/main.css');
} else {
  console.warn('asset-manifest.json not found. Skipping stable filename creation.');
}

// Also copy a minimal index.html into docs/ for quick testing
const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Pacing Calculator Widget</title></head>
<body>
  <script defer src="./static/js/main.js"></script>
  <r2wc-pacing-calculator config='{"currency":"USD","decimals":2}'></r2wc-pacing-calculator>
</body></html>`;
fs.writeFileSync(path.join(docsDir, 'index.html'), html);
console.log('Wrote docs/index.html');
