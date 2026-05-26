const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

function processHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace '<script>(...)push([...])</script>' with ending semicolon ';<script>'
  // Match any script tag containing code that ends with ')' before '</script>'
  const updatedContent = content.replace(/\((self\.__next_f=self\.__next_f\|\|\[\])\)\.push\((.*?)\)<\/script>/g, '($1).push($2);</script>')
                                .replace(/(self\.__next_f\.push\(.*?\))<\/script>/g, '$1;</script>');
  
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Processed and added semicolons to script tags in: ${path.basename(filePath)}`);
}

// Read all HTML files in output directory
if (fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      processHtmlFile(path.join(outDir, file));
    }
  });
}
