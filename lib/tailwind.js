import fs from "fs";
import path from "path";

/**
 * Sets up Tailwind CSS v4 in the newly created project if selected.
 *
 * @param {Array} selectedPackages - The packages selected by the user
 * @param {string} projectDir - Absolute path to the project root
 */
export function setupTailwind(selectedPackages, projectDir) {
  const hasTailwind = selectedPackages.some(
    (p) => p.value === "tailwindcss" || (p.pkg && p.pkg.includes("tailwindcss"))
  );

  if (!hasTailwind) return;

  // In Tailwind v4, we inject `@import "tailwindcss";` into src/index.css
  const cssPath = path.join(projectDir, "src", "index.css");
  if (fs.existsSync(cssPath)) {
    const existingCss = fs.readFileSync(cssPath, "utf-8");
    if (!existingCss.includes('@import "tailwindcss";')) {
      fs.writeFileSync(cssPath, `@import "tailwindcss";\n\n${existingCss}`, "utf-8");
    }
  } else {
    fs.writeFileSync(cssPath, `@import "tailwindcss";\n`, "utf-8");
  }
}
