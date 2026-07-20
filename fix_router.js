import fs from 'fs';
import path from 'path';

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const before = content;
      content = content.replace(
        /const navigate = useRouter\(\);/g, 
        "const router = useRouter();"
      );
      
      if (before !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed router in', fullPath);
      }
    }
  }
}

traverseDir('./app');
traverseDir('./src');
