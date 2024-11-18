// @ts-check
// Originally ported to TS from https://github.com/remix-run/react-router/tree/main/scripts/{version,publish}.js

import { parse as parseCommit } from "@commitlint/parse";
import currentGitBranch from "current-git-branch";
import { execSync } from "node:child_process";
import path from "node:path";
import * as semver from "semver";
import { simpleGit } from "simple-git";
import {
  capitalize,
  getSorterFn,
  readPackageJson,
  releaseCommitMsg,
  updatePackageJson,
} from "./utilities.js";

/**
 * Execute a script being published
 * @param {import('./index').Options} options
 * @returns {Promise<void>}
 */
export const publish = async (options) => {
  const { branchConfigs, packages, rootDir, branch, tag, ghToken } = options;

  const branchName = /** @type {string} */ (branch ?? currentGitBranch());
  const isMainBranch = branchName === "main";
  const npmTag = isMainBranch ? "latest" : branchName;

  /** @type {import('./index').BranchConfig | undefined} */
  const branchConfig = branchConfigs[branchName];

  if (!branchConfig) {
    throw new Error(`No publish config found for branch: ${branchName}`);
  }

  // Get tags
  /** @type {string[]} */
  const allTags = execSync("git tag").toString().split("\n");

  const filteredTags = allTags
    // Ensure tag is valid
    .filter((t) => semver.valid(t))
    // Only include non-prerelease tags from main branch
    .filter((t) => {
      // Exclude any prerelease tags
      return semver.prerelease(t) === null;
    })
    // sort by latest
    // @ts-ignore
    .sort(semver.compare);

  // Get the latest tag
  let latestTag = filteredTags.at(-1);

  let rangeFrom = latestTag;

  // If RELEASE_ALL is set via a commit subject or body, all packages will be
  // released regardless if they have changed files matching the package srcDir.
  let RELEASE_ALL = false;

  // Validate manual tag
  if (tag) {
    if (!semver.valid(tag)) {
      throw new Error(`tag '${tag}' is not a semantically valid version`);
    }
    if (!tag.startsWith("v")) {
      throw new Error(
        `tag must start with "v" (e.g. v0.0.0). You supplied ${tag}`,
      );
    }
    if (allTags.includes(tag)) {
      throw new Error(`tag ${tag} has already been released`);
    }
  }

  if (!latestTag || tag) {
    if (tag) {
      console.info(
        `Tag is set to ${tag}. This will force release all packages. Publishing...`,
      );
      RELEASE_ALL = true;

      // Is it the first release? Is it a major version?
      if (!latestTag || (semver.patch(tag) === 0 && semver.minor(tag) === 0)) {
        rangeFrom = "origin/main";
        latestTag = tag;
      }
    } else {
      throw new Error(
        "Could not find latest tag! To make a release tag of v0.0.1, run with TAG=v0.0.1",
      );
    }
  }

  console.info(`Git Range: ${rangeFrom}..HEAD`);

  const rawCommitsLog = (
    await simpleGit().log({ from: rangeFrom, to: "HEAD" })
  ).all.filter((c) => {
    const exclude = [
      c.message.startsWith("Merge branch "), // No merge commits
      c.message.includes("version & publish"), // No version bump commits
      c.message.startsWith(releaseCommitMsg("")), // No example update commits
    ].some(Boolean);

    return !exclude;
  });

  //   /**
  //    * Get the commits since the latest tag
  //    * @type {import('./index.js').Commit[]}
  //    */
  const commitsSinceLatestTag = await Promise.all(
    rawCommitsLog.map(async (c) => {
      const parsed = await parseCommit(c.message);
      return {
        hash: c.hash.substring(0, 7),
        body: c.body,
        subject: parsed.subject ?? "",
        author_name: c.author_name,
        author_email: c.author_email,
        type: parsed.type?.toLowerCase() ?? "other",
        scope: parsed.scope,
      };
    }),
  );

  console.info(
    `Parsing ${commitsSinceLatestTag.length} commits since ${rangeFrom}...`,
  );

  /**
   * Parses the commit messages, logs them, and determines the type of release needed
   * -1 means no release is necessary
   * 0 means patch release is necessary
   * 1 means minor release is necessary
   * 2 means major release is necessary
   * @type {number}
   */
  let recommendedReleaseLevel = commitsSinceLatestTag.reduce(
    (releaseLevel, commit) => {
      if (commit.type) {
        if (["fix", "refactor", "perf"].includes(commit.type)) {
          releaseLevel = Math.max(releaseLevel, 0);
        }
        if (["feat"].includes(commit.type)) {
          releaseLevel = Math.max(releaseLevel, 1);
        }
        if (commit.body.includes("BREAKING CHANGE")) {
          releaseLevel = Math.max(releaseLevel, 2);
        }
        if (
          commit.subject.includes("RELEASE_ALL") ||
          commit.body.includes("RELEASE_ALL")
        ) {
          RELEASE_ALL = true;
        }
      }
      return releaseLevel;
    },
    -1,
  );

  // If no release is semantically necessary and no manual tag is set, do not release
  if (recommendedReleaseLevel === -1 && !tag) {
    console.info(
      `There have been no changes since ${latestTag} that require a new version. You're good!`,
    );
    return;
  }

  // If no release is semantically necessary but a manual tag is set, do a patch release
  if (recommendedReleaseLevel === -1 && tag) {
    recommendedReleaseLevel = 0;
  }

  const releaseType = branchConfig.prerelease
    ? "prerelease"
    : /** @type {const} */ ({ 0: "patch", 1: "minor", 2: "major" })[
        recommendedReleaseLevel
      ];

  if (!releaseType) {
    throw new Error(`Invalid release level: ${recommendedReleaseLevel}`);
  }

  const version = tag
    ? semver.parse(tag)?.version
    : branchConfig.prerelease
      ? `${semver.inc(latestTag, releaseType, npmTag, false)}.${Date.now()}`
      : semver.inc(latestTag, releaseType, npmTag);

  if (!version) {
    throw new Error(
      [
        "Invalid version increment from semver.inc()",
        `- latestTag: ${latestTag}`,
        `- recommendedReleaseLevel: ${recommendedReleaseLevel}`,
        `- prerelease: ${branchConfig.prerelease}`,
      ].join("\n"),
    );
  }

  console.log(`Targeting version ${version}...`);

  /**
   * Uses git diff to determine which files have changed since the latest tag
   * @type {string[]}
   */
  const changedFiles = tag
    ? []
    : execSync(`git diff ${latestTag} --name-only`)
        .toString()
        .split("\n")
        .filter(Boolean);

  /** Uses packages and changedFiles to determine which packages have changed */
  const changedPackages = RELEASE_ALL
    ? packages
    : packages.filter((pkg) => {
        const changed = changedFiles.some(
          (file) =>
            file.startsWith(path.join(pkg.packageDir, "src")) ||
            // check if any files in the assets directory were modified
            file.startsWith(path.join(pkg.packageDir, "assets")) ||
            file.startsWith(path.join(pkg.packageDir, "package.json")),
        );
        return changed;
      });

  // If a package has a dependency that has been updated, we need to update the
  // package that depends on it as well.
  // run this multiple times so that dependencies of dependencies are also included
  for (let runs = 0; runs < 3; runs++) {
    for (const pkg of packages) {
      const packageJson = await readPackageJson(
        path.resolve(rootDir, pkg.packageDir, "package.json"),
      );
      const allDependencies = Object.keys(
        Object.assign(
          {},
          packageJson.dependencies ?? {},
          packageJson.peerDependencies ?? {},
        ),
      );

      if (
        allDependencies.find((dep) =>
          changedPackages.find((d) => d.name === dep),
        ) &&
        !changedPackages.find((d) => d.name === pkg.name)
      ) {
        console.info(`  Adding dependency ${pkg.name} to changed packages`);
        changedPackages.push(pkg);
      }
    }
  }

  const changelogCommitsMd = await Promise.all(
    Object.entries(
      commitsSinceLatestTag.reduce((prev, curr) => {
        // Only include fix, feat, and chore commits
        if (!["docs", "fix", "feat", "chore"].includes(curr.type)) {
          return prev;
        }
        return {
          ...prev,
          [curr.type]: [...(prev[curr.type] ?? []), curr],
        };
      }, /** @type {Record<string, import('./index').Commit[]>} */ ({})),
    )
      .sort(
        getSorterFn(([type]) => ["docs", "chore", "fix", "feat"].indexOf(type)),
      )
      .reverse()
      .map(async ([type, commits]) => {
        return Promise.all(
          commits.map(async (commit) => {
            let username = "";

            if (ghToken) {
              const query = commit.author_email;

              const res = await fetch(
                `https://api.github.com/search/users?q=${query}`,
                {
                  headers: {
                    Authorization: `token ${ghToken}`,
                  },
                },
              );
              const data = /** @type {unknown} */ (await res.json());
              if (data && typeof data === "object" && "items" in data) {
                if (Array.isArray(data.items) && data.items[0]) {
                  const item = /** @type {object} */ (data.items[0]);
                  if ("login" in item && typeof item.login === "string") {
                    username = item.login;
                  }
                }
              }
            }

            const scope = commit.scope ? `${commit.scope}: ` : "";
            const subject = commit.subject;

            return `- ${scope}${subject} (${commit.hash}) ${
              username
                ? `by @${username}`
                : `by ${commit.author_name || commit.author_email}`
            }`;
          }),
        ).then((c) => /** @type {const} */ ([type, c]));
      }),
  ).then((groups) => {
    return groups
      .map(([type, commits]) => {
        const typeTitle =
          {
            fix: "Bug fixes",
            feat: "Features",
            chore: "Chores",
            docs: "Documentation",
          }[type] || capitalize(type);

        return [`### ${typeTitle}`, commits.join("\n")].join("\n\n");
      })
      .join("\n\n");
  });

  const date = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(Date.now());

  const changelogMd = [
    `Version ${version} - ${date}${tag ? " (Manual Release)" : ""}`,
    "## Changes",
    changelogCommitsMd || "- None",
    "## Packages",
    changedPackages.map((d) => `- ${d.name}@${version}`).join("\n"),
  ].join("\n\n");

  console.info("Generating changelog...");
  console.info();
  console.info(changelogMd);
  console.info();

  if (changedPackages.length === 0) {
    console.info("No packages have been affected.");
    return;
  }

  if (!process.env.CI) {
    console.warn(
      `This is a dry run for version ${version}. Push to CI to publish for real or set CI=true to override!`,
    );
    return;
  }

  console.info(`Updating all changed packages to version ${version}...`);
  // Update each package to the new version
  for (const pkg of changedPackages) {
    console.info(`  Updating ${pkg.name} version to ${version}...`);

    await updatePackageJson(
      path.resolve(rootDir, pkg.packageDir, "package.json"),
      (config) => {
        config.version = version;
      },
    );
  }

  console.info();
  console.info(`Publishing all packages to npm with tag "${npmTag}"`);

  // Publish each package
  for (const pkg of changedPackages) {
    const packageDir = path.join(rootDir, pkg.packageDir);

    const cmd = `cd ${packageDir} && pnpm publish --tag ${npmTag} --access=public --no-git-checks`;
    console.info(`  Publishing ${pkg.name}@${version} to npm...`);
    execSync(cmd, {
      // @ts-ignore
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  }

  console.info();
  console.info("Committing changes...");

  /**
   * We only commit changes on the main branch to avoid creating a new release
   * for every commit on a prerelease branch.
   */
  if (isMainBranch) {
    /**
     * Add all changed files and commit the changes with a release commit message.
     */
    execSync(`git add -A && git commit -m "${releaseCommitMsg(version)}"`);
    console.info("  Committed Changes.");

    console.info();
    console.info("Pushing changes...");
    /**
     * Push the changes to the main branch.
     */
    execSync(`git push origin ${currentGitBranch()}`);
    console.info("  Changes pushed.");

    console.info();
    console.info(`Creating new git tag v${version}`);
    /**
     * Create a new git tag for the release.
     */
    execSync(`git tag -a -m "v${version}" v${version}`);

    console.info();
    console.info("Pushing tags...");
    /**
     * Push the tags to the main branch.
     */
    execSync("git push --tags");
    console.info("  Tags pushed.");
  } else {
    /**
     * Reset the changes to the package.json files so that we don't commit them
     * in the prerelease branch.
     */
    execSync(
      `git reset -- ${changedPackages
        .map((pkg) => path.resolve(rootDir, pkg.packageDir, "package.json"))
        .join(" ")}`,
    );
    /**
     * Checkout the package.json files so that we don't commit them in the
     * prerelease branch.
     */
    execSync(
      `git checkout -- ${changedPackages
        .map((pkg) => path.resolve(rootDir, pkg.packageDir, "package.json"))
        .join(" ")}`,
    );
  }

  if (ghToken && isMainBranch) {
    console.info();
    console.info("Creating github release...");

    // Stringify the markdown to escape any quotes
    execSync(
      `gh release create v${version} ${
        branchConfig.prerelease ? "--prerelease" : ""
      } --notes '${changelogMd.replace(/'/g, '"')}'`,
      { env: { ...process.env, GH_TOKEN: ghToken } },
    );
    console.info("  Github release created.");
  }

  console.info();
  console.info("All done!");
};
