import fs from "fs";
import path from "path";

/**
 * Generates or updates the vite.config file for the project.
 * Sets up plugins, tsconfig/jsconfig path resolver, and optional plugins (Tailwind, PWA, Vitest).
 *
 * @param {Array} selectedPackages - Selected package objects
 * @param {string} projectDir - Absolute path to project folder
 * @param {boolean} isTs - Whether the project uses TypeScript
 */
export function updateViteConfig(selectedPackages, projectDir, isTs = false) {
  const configFile = isTs ? "vite.config.ts" : "vite.config.js";
  const viteConfigPath = path.join(projectDir, configFile);

  // If switching from js to ts config, clean up the old file if present
  if (isTs && fs.existsSync(path.join(projectDir, "vite.config.js"))) {
    try {
      fs.unlinkSync(path.join(projectDir, "vite.config.js"));
    } catch (_) {}
  }

  const hasTailwind = selectedPackages.some((p) => p.value === "tailwindcss");
  const hasPwa = selectedPackages.some((p) => p.value === "vite-pwa");
  const hasVitest = selectedPackages.some((p) => p.value === "vitest");

  const importLines = [
    `import { defineConfig } from "vite";`,
    `import react from "@vitejs/plugin-react";`,
    isTs
      ? `import tsconfigPaths from "vite-tsconfig-paths";`
      : `import jsconfigPaths from "vite-jsconfig-paths";`,
  ];

  if (hasTailwind) {
    importLines.push(`import tailwindcss from "@tailwindcss/vite";`);
  }
  if (hasPwa) {
    importLines.push(`import { VitePWA } from "vite-plugin-pwa";`);
  }

  const plugins = ["react()", isTs ? "tsconfigPaths()" : "jsconfigPaths()"];
  if (hasTailwind) plugins.push("tailwindcss()");
  if (hasPwa) plugins.push(`VitePWA({ registerType: "autoUpdate" })`);

  let testBlock = "";
  if (hasVitest) {
    testBlock = `,\n  test: {\n    globals: true,\n    environment: "jsdom",\n    setupFiles: "./src/test/setup.${isTs ? "ts" : "js"}",\n  }`;
  }

  const viteConfigContent = `/// <reference types="vitest" />
${importLines.join("\n")}

// https://vite.dev/config/
export default defineConfig({
  plugins: [${plugins.join(", ")}]${testBlock}
});
`;

  fs.writeFileSync(viteConfigPath, viteConfigContent, "utf-8");
}

/**
 * Creates or updates jsconfig.json or tsconfig.app.json / tsconfig.json with path aliases
 *
 * @param {Array} selectedPackages - Selected package objects
 * @param {string} projectDir - Absolute path to project folder
 * @param {boolean} isTs - Whether TypeScript is used
 */
export function createPathConfig(selectedPackages, projectDir, isTs = false) {
  const aliasEntries = {
    "@api/*": ["./src/api/*"],
    "@assets/*": ["./src/assets/*"],
    "@components/*": ["./src/components/*"],
    "@ui/*": ["./src/components/ui/*"],
    "@handlers/*": ["./src/handlers/*"],
    "@hooks/*": ["./src/hooks/*"],
    "@middleware/*": ["./src/middleware/*"],
    "@pages/*": ["./src/pages/*"],
    "@routes/*": ["./src/routes/*"],
    "@services/*": ["./src/services/*"],
    "@styles/*": ["./src/styles/*"],
    "@utils/*": ["./src/utils/*"],
  };

  if (selectedPackages.some((p) => ["redux", "zustand"].includes(p.value))) {
    aliasEntries["@store/*"] = ["./src/store/*"];
  }

  if (selectedPackages.some((p) => p.value === "electron")) {
    aliasEntries["@electron/*"] = ["./src/electron/*"];
  }

  if (isTs) {
    // Check if Vite created tsconfig.app.json or tsconfig.json
    const tsconfigAppPath = path.join(projectDir, "tsconfig.app.json");
    const tsconfigPath = path.join(projectDir, "tsconfig.json");
    const targetPath = fs.existsSync(tsconfigAppPath) ? tsconfigAppPath : tsconfigPath;

    let tsconfig = {};
    if (fs.existsSync(targetPath)) {
      try {
        tsconfig = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
      } catch (_) {}
    }

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.baseUrl = ".";
    tsconfig.compilerOptions.paths = {
      ...(tsconfig.compilerOptions.paths || {}),
      ...aliasEntries,
    };

    fs.writeFileSync(targetPath, JSON.stringify(tsconfig, null, 2), "utf-8");
  } else {
    const jsconfigPath = path.join(projectDir, "jsconfig.json");
    let jsconfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: aliasEntries,
      },
      include: ["src/**/*"],
    };

    if (fs.existsSync(jsconfigPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(jsconfigPath, "utf-8"));
        jsconfig = {
          ...existing,
          compilerOptions: {
            ...existing.compilerOptions,
            baseUrl: ".",
            paths: {
              ...(existing.compilerOptions?.paths || {}),
              ...aliasEntries,
            },
          },
        };
      } catch (_) {}
    }

    fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2), "utf-8");
  }
}
