const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for Vercel deployment...');

// Clean dist directory
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log('🧹 Cleaning dist folder...');
}