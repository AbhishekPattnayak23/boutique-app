/**
 * CSS Validation Test Script
 * This script can be used with W3C CSS Validation Service or another CSS linter
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Test files
const cssFiles = [
  '../public/css/login.css',
  '../public/css/responsive.css',
  '../public/css/utils.css'
];

console.log('CSS Validation Test');
console.log('==================');

// Check if files exist
cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    if (fs.existsSync(filePath)) {
      console.log(` ${file} exists`);
    } else {
      console.error(` ${file} does not exist`);
    }
  } catch(err) {
    console.error(`Error checking ${file}: ${err.message}`);
  }
});

console.log('\nMedia Query Test');
console.log('================');

// Test for proper media queries in responsive.css
try {
  const responsiveCssPath = path.join(__dirname, '../public/css/responsive.css');
  const cssContent = fs.readFileSync(responsiveCssPath, 'utf8');

  const checks = [
    { pattern: /@media.*min-width:\s*576px/, name: 'Small device breakpoint' },
    { pattern: /@media.*min-width:\s*768px/, name: 'Medium device breakpoint' },
    { pattern: /@media.*min-width:\s*992px/, name: 'Large device breakpoint' },
    { pattern: /@media.*min-width:\s*1200px/, name: 'Extra large device breakpoint' }
  ];

  checks.forEach(check => {
    if (check.pattern.test(cssContent)) {
      console.log(` ${check.name} found`);
    } else {
      console.error(` ${check.name} not found`);
    }
  });
} catch(err) {
  console.error(`Error testing responsive.css: ${err.message}`);
}

console.log('\nTo run the actual CSS validation with W3C service:');
console.log('1. Go to https://jigsaw.w3.org/css-validator/');
console.log('2. Upload the CSS files or validate by URI after deployment');
