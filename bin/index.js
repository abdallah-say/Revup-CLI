#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as p from "@clack/prompts";

import { packagesList } from "../lib/packages.js";
import { promptPackages } from "../lib/interactive.js";
import { installPackages } from "../lib/installer.js";
import { createFolders } from "../lib/folders.js";
import { setupTailwind } from "../lib/tailwind.js";
import { updateViteConfig, createPathConfig } from "../lib/config.js";

// Helper to detect default package manager from user agent
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  return "npm";
}

async function main() {
  console.clear();
  p.intro("👨‍💻 Revup CLI — React + Vite Project Generator");

  // 1️⃣ Project Name
  const projectNameInput = await p.text({
    message: "Enter your project name:",
    placeholder: "my-revup-app",
    defaultValue: "my-revup-app",
    validate: (value) => {
      if (!value) return "Project name cannot be empty";
      if (/[/\\]/.test(value)) return "Invalid project name format";
    },
  });

  if (p.isCancel(projectNameInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const name = projectNameInput.trim();
  const projectDir = path.resolve(process.cwd(), name);

  // 2️⃣ Select Language (TypeScript vs JavaScript)
  const language = await p.select({
    message: "Select project language:",
    options: [
      { value: "react-ts", label: "React + TypeScript", hint: "Recommended" },
      { value: "react", label: "React + JavaScript" },
    ],
  });

  if (p.isCancel(language)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const isTs = language === "react-ts";

  // 3️⃣ Select Package Manager
  const defaultPm = detectPackageManager();
  const packageManager = await p.select({
    message: "Select your preferred package manager:",
    initialValue: defaultPm,
    options: [
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
      { value: "bun", label: "bun" },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  // 4️⃣ Select Optional Libraries
  const selectedPackages = await promptPackages(packagesList);

  const s = p.spinner();
  s.start(`Scaffolding Vite project inside ${name}...`);

  try {
    // Scaffold Vite + React project using create-vite
    const createCmd = `${packageManager} create vite@latest "${name}" -- --template ${language}`;
    execSync(createCmd, {
      stdio: "ignore",
      shell: true,
    });

    s.message("Installing dependencies and selected packages...");
    await installPackages(selectedPackages, projectDir, packageManager, isTs);

    s.message("Setting up folder architecture and path aliases...");
    createFolders(selectedPackages, projectDir, isTs);
    setupTailwind(selectedPackages, projectDir);
    updateViteConfig(selectedPackages, projectDir, isTs);
    createPathConfig(selectedPackages, projectDir, isTs);

    // Copy update-aliases.js utility script
    const scriptsDir = path.join(projectDir, "scripts");
    fs.mkdirSync(scriptsDir, { recursive: true });

    const templatePath = fileURLToPath(
      new URL("../templates/update-aliases.js", import.meta.url)
    );
    const targetPath = path.join(scriptsDir, "update-aliases.js");
    fs.copyFileSync(templatePath, targetPath);
    try {
      fs.chmodSync(targetPath, 0o755);
    } catch (_) {}

    // Add npm script to project package.json
    const projectPkgPath = path.join(projectDir, "package.json");
    if (fs.existsSync(projectPkgPath)) {
      const projectPkg = JSON.parse(fs.readFileSync(projectPkgPath, "utf-8"));
      projectPkg.scripts = projectPkg.scripts || {};
      projectPkg.scripts["update-aliases"] = "node scripts/update-aliases.js";

      // If Vitest was selected, add test script
      if (selectedPackages.some((p) => p.value === "vitest")) {
        projectPkg.scripts["test"] = "vitest";
      }

      fs.writeFileSync(projectPkgPath, JSON.stringify(projectPkg, null, 2), "utf-8");
    }

    s.stop(`🎉 Project ${name} is ready!`);

    const cdCmd = `cd ${name}`;
    const devCmd = `${packageManager} ${packageManager === "npm" ? "run " : ""}dev`;

    p.outro(
      `Next steps:\n  1. \x1b[36m${cdCmd}\x1b[0m\n  2. \x1b[36m${devCmd}\x1b[0m\n\nRun \x1b[36m${packageManager} run update-aliases\x1b[0m anytime you create new directories under src/!`
    );
  } catch (error) {
    s.stop("Failed to scaffold project.");
    p.cancel(`Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
