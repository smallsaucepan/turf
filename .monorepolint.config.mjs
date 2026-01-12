import * as path from "node:path";
import { glob } from "glob";
import * as fs from "node:fs";
import {
  alphabeticalDependencies,
  alphabeticalScripts,
  packageOrder,
  packageEntry,
  packageScript,
  requireDependency,
  standardTsconfig,
  fileContents,
} from "@monorepolint/rules";

const BUILD_PACKAGES = []; // packages to build using Typescript
const AGG_PACKAGE = "@turf/turf"; // aggregate package utilising rollup

const TAPE_PACKAGES = []; // packages with tape tests
const TYPES_PACKAGES = []; // packages with types tests

// iterate all the packages and figure out what buckets everything falls into
const __dirname = new URL(".", import.meta.url).pathname;
glob.sync(path.join(__dirname, "packages", "*")).forEach((pk) => {
  const name = JSON.parse(
    fs.readFileSync(path.join(pk, "package.json"), "utf8")
  ).name;

  if (fs.existsSync(path.join(pk, "index.ts"))) {
    BUILD_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "test.ts"))) {
    TAPE_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "types.ts"))) {
    TYPES_PACKAGES.push(name);
  }
});

export default {
  rules: [
    packageOrder({
      options: {
        order: [
          "name",
          "version",
          "private",
          "description",
          "author",
          "contributors",
          "license",
          "bugs",
          "homepage",
          "repository",
          "funding",
          "publishConfig",
          "keywords",
          "type",
          "main",
          "module",
          "types",
          "exports",
          "browser",
          "sideEffects",
          "files",
          "scripts",
          "husky",
          "lint-staged",
          "packageManager",
          "devDependencies",
          "dependencies",
        ],
      },
      includeWorkspaceRoot: true,
    }),
    alphabeticalDependencies({ includeWorkspaceRoot: true }),
    alphabeticalScripts({ includeWorkspaceRoot: true }),
    standardTsconfig({
      options: { templateFile: "./templates/package/tsconfig.json" },
      includePackages: BUILD_PACKAGES,
    }),
    standardTsconfig({
      options: {
        file: "tsconfig.cjs.json",
        templateFile: "./templates/package/tsconfig.cjs.json",
      },
      includePackages: BUILD_PACKAGES,
    }),
    packageEntry({
      options: {
        entries: {
          type: "module",
          main: "dist/cjs/index.js",
          module: "dist/esm/index.js",
          types: "dist/esm/index.d.ts",
          sideEffects: false,
          publishConfig: {
            access: "public",
          },
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.ts",
                default: "./dist/esm/index.js",
              },
              require: {
                types: "./dist/cjs/index.d.ts",
                default: "./dist/cjs/index.js",
              },
            },
          },
        },
      },
      includePackages: BUILD_PACKAGES,
    }),
    packageEntry({
      options: {
        entries: {
          files: ["dist"],
        },
      },
      includePackages: BUILD_PACKAGES,
      excludePackages: [AGG_PACKAGE],
    }),
    packageEntry({
      options: {
        entries: {
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Ex ample of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "turf.min.js"],
        },
      },
      includePackages: [AGG_PACKAGE],
    }),
    packageEntry({
      options: {
        entries: {
          funding: "https://opencollective.com/turf",
        },
      },
    }),
    packageScript({
      options: {
        scripts: {
          docs: "tsx ../../scripts/generate-readmes.ts",
          rollup: "rollup -c rollup.config.js",
          test: "pnpm run /test:.*/",
        },
      },
      includePackages: [AGG_PACKAGE],
    }),
    packageScript({
      options: {
        scripts: {
          build: "pnpm run /build:.*/",
          "build:cjs": "tsc -b tsconfig.cjs.json",
          "build:esm": "tsc -b",
        },
      },
      includePackages: BUILD_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          bench: "tsx bench.ts",
          "test:tape": "tsx test.ts",
        },
      },
      includePackages: TAPE_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          "test:types": "tsc --project tsconfig.types.json",
        },
      },
      includePackages: TYPES_PACKAGES,
    }),

    fileContents({
      options: {
        file: "tsconfig.types.json",
        templateFile: "./templates/package/tsconfig.types.json",
      },
      includePackages: TYPES_PACKAGES,
    }),

    requireDependency({
      options: {
        dependencies: {
          "@types/geojson": "^7946.0.10",
          tslib: "^2.8.1",
        },
        devDependencies: {
          "@types/benchmark": "^2.1.5",
          "@types/tape": "^5.8.1",
          benchmark: "^2.1.4",
          tape: "^5.9.0",
          tsx: "^4.19.4",
          typescript: "^5.8.3",
        },
      },
      includePackages: BUILD_PACKAGES,
    }),
  ],
};
