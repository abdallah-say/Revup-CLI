import fs from "fs";
import path from "path";

/**
 * Creates the standard folder structure for a React Vite project.
 *
 * @param {Array} selectedPackages - List of packages selected by the user
 * @param {string} projectDir - Absolute path to the project folder
 * @param {boolean} isTs - Whether TypeScript is used
 */
export function createFolders(selectedPackages, projectDir, isTs = false) {
  const baseFolders = [
    "api",
    "components/ui",
    "handlers",
    "hooks",
    "middleware",
    "pages",
    "routes",
    "services",
    "styles",
    "utils",
  ];

  baseFolders.forEach((folder) => {
    fs.mkdirSync(path.join(projectDir, "src", folder), { recursive: true });
  });

  const selectedKeys = selectedPackages.map((p) => p.value || p.name);

  // If State management is selected, create a store folder
  if (selectedKeys.some((k) => ["redux", "zustand", "Redux"].includes(k))) {
    fs.mkdirSync(path.join(projectDir, "src", "store"), { recursive: true });
  }

  // If Electron is selected, create an electron folder
  if (selectedKeys.some((k) => ["electron", "Electron"].includes(k))) {
    fs.mkdirSync(path.join(projectDir, "src", "electron"), { recursive: true });
  }

  // If Vitest is selected, set up test directory and setup file
  if (selectedKeys.some((k) => ["vitest", "Vitest"].includes(k))) {
    const testDir = path.join(projectDir, "src", "test");
    fs.mkdirSync(testDir, { recursive: true });

    const setupFile = path.join(testDir, `setup.${isTs ? "ts" : "js"}`);
    if (!fs.existsSync(setupFile)) {
      fs.writeFileSync(
        setupFile,
        `import "@testing-library/jest-dom";\n`,
        "utf-8"
      );
    }
  }
}
