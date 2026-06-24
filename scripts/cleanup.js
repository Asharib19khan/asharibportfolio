const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Clean up dupes from the previous script
  content = content.replace(/text-gray-600 dark:text-gray-600 dark:text-gray-400/g, "text-gray-600 dark:text-gray-400");
  content = content.replace(/text-black dark:text-black dark:text-white/g, "text-black dark:text-white");
  content = content.replace(/border-black\/10 dark:border-black\/10 dark:border-white\/10/g, "border-black/10 dark:border-white/10");
  content = content.replace(/bg-black\/5 dark:bg-black\/5 dark:bg-white\/5/g, "bg-black/5 dark:bg-white/5");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${file}`);
  }
});
