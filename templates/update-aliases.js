#!/usr/bin/env node
import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

if (!fs.existsSync(srcDir)) {
  console.error("❌ src directory not found. Make sure you run this script from your project root.");
  process.exit(1);
}

// Recursively find top-level and relevant subdirectories in src
const folders = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Build dynamic paths map
const newPaths = {};

folders.forEach((f) => {
  newPaths[`@${f}/*`] = [`./src/${f}/*`];

  // Special handling for components/ui -> @ui/*
  if (f === "components") {
    const componentsDir = path.join(srcDir, "components");
    const subFolders = fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    subFolders.forEach((sub) => {
      newPaths[`@${sub}/*`] = [`./src/components/${sub}/*`];
    });
  }
});

// Determine target configuration file (tsconfig.app.json, tsconfig.json, or jsconfig.json)
const tsconfigAppPath = path.join(projectRoot, "tsconfig.app.json");
const tsconfigPath = path.join(projectRoot, "tsconfig.json");
const jsconfigPath = path.join(projectRoot, "jsconfig.json");

let targetFile = null;
if (fs.existsSync(tsconfigAppPath)) {
  targetFile = tsconfigAppPath;
} else if (fs.existsSync(tsconfigPath)) {
  targetFile = tsconfigPath;
} else {
  targetFile = jsconfigPath;
}

let config = { compilerOptions: { baseUrl: ".", paths: {} } };

if (fs.existsSync(targetFile)) {
  try {
    config = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
  } catch (err) {
    console.error(`⚠️ Error reading ${path.basename(targetFile)}:`, err.message);
  }
}

config.compilerOptions = config.compilerOptions || {};
config.compilerOptions.baseUrl = ".";
config.compilerOptions.paths = {
  ...(config.compilerOptions.paths || {}),
  ...newPaths,
};

fs.writeFileSync(targetFile, JSON.stringify(config, null, 2), "utf-8");
console.log(`✅ ${path.basename(targetFile)} path aliases updated!`);
