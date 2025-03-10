import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination paths
const source = path.join(__dirname, "node_modules", "tinymce");
const destination = path.join(__dirname, "public", "tinymce");

// Check if TinyMCE is installed
if (!fs.existsSync(source)) {
  console.error(
    'TinyMCE is not installed. Please run "npm install tinymce" first.'
  );
  process.exit(1);
}

// Copy the files
try {
  // Remove old files first
  fs.removeSync(destination);

  // Copy the whole TinyMCE folder
  fs.copySync(source, destination, {
    filter: (src) => {
      // Skip unnecessary files and directories
      const relativePath = path.relative(source, src);
      return (
        !relativePath.includes("node_modules") &&
        !relativePath.includes(".git") &&
        !relativePath.includes("package.json")
      );
    },
  });

  console.log("TinyMCE files copied successfully to public/tinymce");
} catch (err) {
  console.error("Error copying TinyMCE files:", err);
  process.exit(1);
}
