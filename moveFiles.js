const fs = require("fs-extra");
const path = require("path");

const source = path.join(__dirname, "frontend", "dist");
const destination = path.join(__dirname, "backend", "public");

async function moveBuild() {
  try {
    console.log("Removing old build files...");
    await fs.remove(destination);

    console.log("Copying new build files...");
    await fs.copy(source, destination);

    console.log("✅ Frontend build moved successfully!");
  } catch (err) {
    console.error("❌ Error moving frontend build:", err);
    process.exit(1);
  }
}

moveBuild();
