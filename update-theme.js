const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { regex: /text-theme-text/g, replacement: "text-black dark:text-white transition-colors duration-700" },
  { regex: /text-theme-muted/g, replacement: "text-gray-600 dark:text-gray-400 transition-colors duration-700" },
  { regex: /bg-theme-bg/g, replacement: "bg-white dark:bg-[#050505] transition-colors duration-700" },
  { regex: /bg-theme-glass/g, replacement: "bg-black/5 dark:bg-white/5 transition-colors duration-700" },
  { regex: /border-theme-border/g, replacement: "border-black/10 dark:border-white/10 transition-colors duration-700" },
  
  // also fix some hardcoded ones safely without breaking syntax
  { regex: /text-white/g, replacement: "text-black dark:text-white" },
  { regex: /text-gray-400/g, replacement: "text-gray-600 dark:text-gray-400" },
  { regex: /border-white\/10/g, replacement: "border-black/10 dark:border-white/10" },
  { regex: /border-white\/5/g, replacement: "border-black/5 dark:border-white/5" },
  { regex: /bg-white\/5/g, replacement: "bg-black/5 dark:bg-white/5" },
  { regex: /bg-white\/10/g, replacement: "bg-black/10 dark:bg-white/10" },
];

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(r => {
    // Only replace if not inside a complex expression or already replaced
    // Actually regex is fine since we are careful
    content = content.replace(r.regex, r.replacement);
  });
  
  // Clean up any double replacements (e.g. text-black dark:text-black dark:text-white)
  content = content.replace(/text-black dark:text-black dark:text-white/g, "text-black dark:text-white");
  content = content.replace(/border-black\/10 dark:border-black\/10 dark:border-white\/10/g, "border-black/10 dark:border-white/10");
  content = content.replace(/bg-black\/5 dark:bg-black\/5 dark:bg-white\/5/g, "bg-black/5 dark:bg-white/5");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
