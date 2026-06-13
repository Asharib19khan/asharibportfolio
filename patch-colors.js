const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const replaceRules = [
  { regex: /bg-\[\#050505\]/g, replacement: 'bg-theme-bg' },
  { regex: /text-white(?!\/)/g, replacement: 'text-theme-text' },
  { regex: /text-gray-400/g, replacement: 'text-theme-muted' },
  { regex: /text-white\/[0-9]+/g, replacement: 'text-theme-muted' },
  { regex: /border-white\/[0-9]+/g, replacement: 'border-theme-border' },
  { regex: /bg-white\/[0-9]+/g, replacement: 'bg-theme-glass' },
  { regex: /hover:text-white/g, replacement: 'hover:text-theme-text' },
  { regex: /hover:border-white(?!\/)/g, replacement: 'hover:border-theme-text' },
  { regex: /hover:border-theme-border(?!\/)/g, replacement: 'hover:border-theme-text' } // cleanup from previous line
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('ThemeToggle')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replaceRules.forEach(rule => {
        content = content.replace(rule.regex, rule.replacement);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Patched ${file}`);
      }
    }
  }
}

processDir(componentsDir);
