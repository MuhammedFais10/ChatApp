const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(__dirname, "frontend", "dist");
const destDir = path.resolve(__dirname, "backend", "public");

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Error: Source directory ${sourceDir} does not exist.`);
  process.exit(1);
}

// Function to copy files from source to destination
function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyFiles(sourceDir, destDir);
console.log("Files moved successfully");
