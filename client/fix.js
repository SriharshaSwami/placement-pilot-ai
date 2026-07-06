const fs = require('fs');
const path = require('path');
const templatesDir = path.join('src', 'features', 'resume-generator', 'templates');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("import { EditableNode } from '../../editor/EditableNode.jsx';")) {
        content = content.replace("import { EditableNode } from '../../editor/EditableNode.jsx';", "import { EditableNode } from '../../components/editor/EditableNode.jsx';");
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}
walkDir(templatesDir);
console.log('Done');
