const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/map.jsx',
  'src/pages/wastelog.jsx',
  'src/pages/auth.jsx',
  'src/pages/active-claim.jsx',
  'src/pages/Leaderboard.jsx',
  'src/pages/dashboard.jsx',
  'src/components/ReviewsDrawer.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = false;

  // Replace double quotes "http://localhost:5001/api..." with `${API_BASE_URL}...`
  if (content.includes('"http://localhost:5001/api')) {
    content = content.replace(/"http:\/\/localhost:5001\/api([^"]*)"/g, '`${API_BASE_URL}$1`');
    updated = true;
  }

  // Replace backticks `http://localhost:5001/api...` with `${API_BASE_URL}...`
  if (content.includes('`http://localhost:5001/api')) {
    content = content.replace(/`http:\/\/localhost:5001\/api([^`]*)`/g, '`${API_BASE_URL}$1`');
    updated = true;
  }

  // Replace single quotes 'http://localhost:5001/api...' with `${API_BASE_URL}...`
  if (content.includes("'http://localhost:5001/api")) {
    content = content.replace(/'http:\/\/localhost:5001\/api([^']*)'/g, '`${API_BASE_URL}$1`');
    updated = true;
  }

  if (updated) {
    // Add import statement if not present
    if (!content.includes('API_BASE_URL')) {
      // Find the last import statement
      const importMatches = [...content.matchAll(/^import .*;?$/gm)];
      if (importMatches.length > 0) {
        const lastMatch = importMatches[importMatches.length - 1];
        const insertPos = lastMatch.index + lastMatch[0].length;
        
        let depth = file.split('/').length - 2; // e.g. src/pages/map.jsx -> pages/map.jsx -> 1 level deep -> '../config/api'
        let importPath = '';
        if (depth === 0) importPath = './config/api';
        else if (depth === 1) importPath = '../config/api';
        else if (depth === 2) importPath = '../../config/api';
        
        content = content.slice(0, insertPos) + `\nimport { API_BASE_URL } from "${importPath}";` + content.slice(insertPos);
      } else {
        content = `import { API_BASE_URL } from "../config/api";\n` + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
