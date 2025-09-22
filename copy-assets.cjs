const fs = require('fs');
const path = require('path');

const copyFile = (src, dest) => {
  ensureDirectoryExists(dest);
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Failed to copy ${src} to ${dest}:`, error);
    throw error;
  }
};

const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyWebviewAssets = () => {
  console.log('Copying webview assets...');
  
  const srcDir = path.join(__dirname, 'src', 'webview');
  const destDir = __dirname;
  
  // Copy webview.html
  const htmlSrc = path.join(srcDir, 'webview.html');
  const htmlDest = path.join(destDir, 'webview.html');
  copyFile(htmlSrc, htmlDest);
  
  // Copy webview.css
  const cssSrc = path.join(srcDir, 'webview.css');
  const cssDest = path.join(destDir, 'webview.css');
  copyFile(cssSrc, cssDest);
  
  console.log('Webview assets copied successfully!');
};

module.exports = { copyWebviewAssets };

// If this script is run directly
if (require.main === module) {
  copyWebviewAssets();
}