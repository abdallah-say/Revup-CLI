import * as p from "@clack/prompts";

/**
 * Modern interactive prompt interface powered by @clack/prompts.
 *
 * @param {Array} packagesList - List of package objects
 * @returns {Promise<Array>} - Resolves with selected package objects
 */
export async function promptPackages(packagesList) {
  const options = packagesList.map((item) => ({
    value: item.value,
    label: item.label,
    hint: item.hint,
  }));

  const selectedValues = await p.multiselect({
    message: "Select optional libraries and plugins to include:",
    options: options,
    required: false,
  });

  if (p.isCancel(selectedValues)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return packagesList.filter((pkg) => selectedValues.includes(pkg.value));
}
