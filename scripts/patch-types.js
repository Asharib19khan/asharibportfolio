const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace 'spring' with 'spring' as const
    let modified = content.replace(/type:\s*['"]spring['"]/g, 'type: "spring" as const');
    
    if (content !== modified) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`Patched ${file}`);
    }
  }
});
