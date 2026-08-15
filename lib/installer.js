import { execSync } from "child_process";

/**
 * Installs selected npm packages using the specified package manager.
 *
 * @param {Array} selectedPackages - Selected package objects
 * @param {string} projectDir - Absolute path to the project directory
 * @param {string} pm - Package manager ('npm' | 'pnpm' | 'yarn' | 'bun')
 * @param {boolean} isTs - Whether the project uses TypeScript
 */
export async function installPackages(selectedPackages, projectDir, pm = "npm", isTs = false) {
  // Always include path alias plugin for Vite
  const devAliasPkg = isTs ? "vite-tsconfig-paths" : "vite-jsconfig-paths";

  const devDeps = selectedPackages
    .filter((p) => p.dev)
    .map((p) => p.pkg);

  // Add the path alias plugin to devDependencies
  devDeps.push(devAliasPkg);

  const deps = selectedPackages
    .filter((p) => !p.dev)
    .map((p) => p.pkg);

  // Command helper per package manager
  const getInstallCmd = (packages, isDev) => {
    const pkgString = packages.join(" ");
    switch (pm) {
      case "pnpm":
        return `pnpm add ${isDev ? "-D " : ""}${pkgString}`;
      case "yarn":
        return `yarn add ${isDev ? "-D " : ""}${pkgString}`;
      case "bun":
        return `bun add ${isDev ? "-d " : ""}${pkgString}`;
      case "npm":
      default:
        return `npm install ${isDev ? "-D " : ""}${pkgString}`;
    }
  };

  // Run install commands if packages exist
  if (deps.length > 0) {
    execSync(getInstallCmd(deps, false), {
      stdio: "inherit",
      shell: true,
      cwd: projectDir,
    });
  }

  if (devDeps.length > 0) {
    execSync(getInstallCmd(devDeps, true), {
      stdio: "inherit",
      shell: true,
      cwd: projectDir,
    });
  }
}
