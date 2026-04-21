const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Names
    content = content.replace(/Institute of Excellence/g, 'BONSAI EDUCATIONS');
    content = content.replace(/Institute Portal/g, 'BONSAI PORTAL');
    content = content.replace(/Institute/g, 'Bonsai Educations');
    content = content.replace(/tuition center/gi, 'BONSAI EDUCATIONS');
    content = content.replace(/institute.edu/g, 'bonsaieducations.com');

    // Colors
    content = content.replace(/text-blue-/g, 'text-amber-');
    content = content.replace(/bg-blue-/g, 'bg-amber-');
    content = content.replace(/border-blue-/g, 'border-amber-');
    content = content.replace(/ring-blue-/g, 'ring-amber-');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
