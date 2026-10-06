import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SINGLETONS = [
  "@edifice.io+react",
  "@edifice.io+client",
  "@tanstack+react-query",
  "react",
  "react-dom",
];

const SEPARATOR = "=".repeat(60);

/**
 * Fails if an Edifice singleton package is physically duplicated in node_modules.
 * @param {{ cwd?: string }} [options]
 * @returns {number} exit code
 */
export function checkSingletons({ cwd = process.cwd() } = {}) {
  console.log(SEPARATOR);
  console.log("Edifice singleton check");
  console.log(SEPARATOR);

  const pnpmDir = join(cwd, "node_modules", ".pnpm");

  if (!existsSync(pnpmDir)) {
    console.log("OK: no node_modules/.pnpm found, nothing to check.");
    console.log(SEPARATOR);
    return 0;
  }

  const entries = readdirSync(pnpmDir);
  let status = 0;

  for (const pkg of SINGLETONS) {
    const matches = entries.filter((entry) => entry.startsWith(`${pkg}@`));
    if (matches.length > 1) {
      console.log(`FAIL: ${pkg} has ${matches.length} physical copies:`);
      matches.forEach((match) => console.log(`  ${match}`));
      status = 1;
    }
  }

  if (status === 0) {
    console.log("OK: no duplicated singleton.");
  } else {
    console.log(
      "A package is bundling its own copy of a socle/react-query singleton instead of using peerDependencies, or two apps/packages pin incompatible versions. See docs/enabling-1099 in this repo for the fix.",
    );
  }

  console.log(SEPARATOR);

  return status;
}
