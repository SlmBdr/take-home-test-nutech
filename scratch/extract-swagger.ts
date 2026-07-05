import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'swagger-ui-init.js');
const content = fs.readFileSync(filePath, 'utf8');

// We want to extract the content inside "swaggerDoc": { ... }
// Let's find the start of the swaggerDoc object
const docStartMarker = '"swaggerDoc":';
const docStartIndex = content.indexOf(docStartMarker);
if (docStartIndex === -1) {
  console.error('Could not find swaggerDoc start');
  process.exit(1);
}

// Find the end where customOptions starts
const docEndMarker = '"customOptions":';
const docEndIndex = content.indexOf(docEndMarker);
if (docEndIndex === -1) {
  console.error('Could not find customOptions end');
  process.exit(1);
}

// Extract the string. It will look like: { ... }, \n  
let docStr = content.substring(docStartIndex + docStartMarker.length, docEndIndex).trim();

// Remove the trailing comma if it exists
if (docStr.endsWith(',')) {
  docStr = docStr.substring(0, docStr.length - 1).trim();
}

try {
  const json = JSON.parse(docStr);
  fs.writeFileSync(path.join(process.cwd(), 'src', 'swagger.json'), JSON.stringify(json, null, 2), 'utf8');
  console.log('Successfully extracted swagger.json!');
} catch (err) {
  console.error('Failed to parse swagger doc JSON:', err);
}
