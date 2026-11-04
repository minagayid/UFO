# CI diagnostics and dependency repair

This runbook documents the commands and decision points for diagnosing this repository's CI failures. Keep the dependency audit gate enabled; do not hide audit findings by lowering its threshold or making the job non-blocking.

## Reproduce the checks

Use the Node versions configured in `.github/workflows/ci.yml` and record the exact toolchain versions first:

```sh
node --version
npm --version
npm ci
npm audit --audit-level=moderate
npx tsc --noEmit
npm run build
```

Run these commands from a clean checkout. Capture the CI run URL, branch, commit SHA, failed job, failed step, and the complete error text.

## Diagnose `npm ci` lockfile errors

An error such as `Missing: <package>@<version> from lock file` means the committed lockfile does not contain all dependency records required by the declared dependency graph. Optional platform packages still need lockfile records even when a Linux runner will not install packages for other operating systems.

Repair the lockfile with the repository's declared `package.json` and a current npm version:

```sh
npm install --package-lock-only
git diff -- package-lock.json
npm ci
```

Review the lockfile diff for unexpected runtime version changes before committing it. Do not replace `npm ci` with an unpinned `npm install` in CI to conceal a stale lockfile.

## Diagnose dependency audit failures

```sh
npm audit --json > npm-audit.json
npm audit --audit-level=moderate
npm ls vite esbuild postcss nanoid source-map-js
```

Review the advisory, affected dependency path, patched version, and whether the remediation changes a direct dependency's major version. Prefer non-breaking updates first. Treat major toolchain changes (including Vite) as a separate change: update compatible plugins, then run the full Node matrix, TypeScript check, and production build. Do not use `npm audit fix --force` without reviewing and testing the major-version changes it proposes.

## Current finding from 4 November 2026

The latest `main` workflow run (`41830743864`) had two independent failures:

- Node 24's `npm ci` rejected missing optional platform entries for the existing esbuild, Rollup, and fsevents versions. This PR restores those lockfile records without changing the selected dependency versions.
- The dependency audit reported 8 findings (3 moderate and 5 high), including esbuild/Vite, nanoid, PostCSS, postcss-selector-parser, source-map-js, Browserslist, and baseline-browser-mapping. The reported remediation for the esbuild/Vite finding requires a Vite major-version change. This PR deliberately leaves the audit gate intact; the compatible Vite/plugin upgrade and full build validation remain a separate required follow-up.
