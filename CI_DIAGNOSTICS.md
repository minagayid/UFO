# CI diagnostics and dependency repair

This runbook records the repository's CI gates, common failure modes, and the dependency remediation applied on 5 November 2026. Keep the dependency audit gate enabled; do not hide findings by lowering its threshold or making the job non-blocking.

## Reproduce the required checks

Use the Node versions in `.github/workflows/ci.yml` and record the exact toolchain versions first:

```sh
node --version
npm --version
npm ci
npm audit --audit-level=moderate
npx tsc --noEmit
npm run build
```

Run from a clean checkout. For a CI failure, record the run URL, event type, branch, commit SHA, job, step, tool versions, and complete error text. Distinguish installation errors, code/build errors, audit failures, and scanner failures; do not infer the cause from a red job alone.

## Diagnose `npm ci` lockfile errors

An error such as `Missing: <package>@<version> from lock file` means the committed lockfile does not contain all package records required by the declared dependency graph. Optional platform-specific packages still need lockfile records even when a Linux runner will not install packages for other operating systems.

To regenerate the lockfile from the declared dependencies and apply only compatible security updates:

```sh
npm install --package-lock-only --ignore-scripts
npm audit fix --package-lock-only --ignore-scripts
git diff -- package.json package-lock.json
npm ci
```

Review the diff for unexpected direct dependency changes. Do not replace reproducible CI installation (`npm ci`) with `npm install` merely to conceal a stale lockfile.

## Diagnose dependency audit failures

```sh
npm audit --json > npm-audit.json
npm audit --audit-level=moderate
npm ls vite @vitejs/plugin-react esbuild postcss nanoid baseline-browser-mapping browserslist postcss-selector-parser source-map-js
```

For each advisory, inspect the affected path, severity, patched version, and whether a fix requires a direct dependency major-version change. Apply semver-compatible transitive updates first. When a toolchain major upgrade is needed, upgrade the direct tool and its compatible plugins together, then run the full Node matrix, TypeScript check, and production build. Do not use `npm audit fix --force` without a separate compatibility review and build validation.

## Remediation applied on 5 November 2026

The 4 November main-branch run (`41830743864`) exposed two independent problems:

- Node 24 `npm ci` failed because lockfile entries for optional esbuild, Rollup, and fsevents platform packages were missing. The initial lockfile repair restored those records.
- The dependency audit reported 8 vulnerabilities (3 moderate, 5 high). The primary build-tool path came through Vite 5 and esbuild; the remaining findings were in the Browserslist, nanoid, PostCSS, postcss-selector-parser, and source-map-js dependency paths.

This PR now:
- moves Vite to the maintained 6.4.5 line and the React plugin to 4.7.0, which supports Vite 6;
- regenerates the lockfile and applies non-breaking security updates;
- retains the blocking `npm audit --audit-level=moderate` gate.

The verified lockfile resolves Vite 6.4.5, esbuild 0.25.12, postcss 8.5.32, nanoid 3.3.20, baseline-browser-mapping 2.11.35, browserslist 4.29.5, postcss-selector-parser 6.1.5, and source-map-js 1.2.2. The GitHub runner reported a successful clean install and `found 0 vulnerabilities` from `npm audit --audit-level=moderate`. The PR's standard Node 22/24 build and TypeScript jobs remain the final application-level verification gates.

## Security and review boundaries

- Keep TruffleHog enabled. A clean secret scan is independent from dependency-audit status.
- Do not weaken required checks, add `continue-on-error` to required security gates, or ignore advisories without an explicit, documented risk decision.
- Do not treat CI success as production deployment approval; deployment requires its own review and operational checks.
