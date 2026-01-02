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

const TS_PACKAGES = []; // projects that use typescript to build
const JS_PACKAGES = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES = []; // projects that have tape tests
const TYPES_PACKAGES = []; // projects that have types tests

// iterate all the packages and figure out what buckets everything falls into
const __dirname = new URL(".", import.meta.url).pathname;
glob.sync(path.join(__dirname, "packages", "turf-*")).forEach((pk) => {
  const name = JSON.parse(
    fs.readFileSync(path.join(pk, "package.json"), "utf8")
  ).name;

  if (fs.existsSync(path.join(pk, "index.ts"))) {
    TS_PACKAGES.push(name);
  } else {
    JS_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "test.js"))) {
    TAPE_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "types.ts"))) {
    TYPES_PACKAGES.push(name);
  }
});

const TS_TAPE_PACKAGES = TAPE_PACKAGES.filter(
  (pkg) => -1 !== TS_PACKAGES.indexOf(pkg)
);
const JS_TAPE_PACKAGES = TAPE_PACKAGES.filter(
  (pkg) => -1 !== JS_PACKAGES.indexOf(pkg)
);

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
      includePackages: [...TS_PACKAGES, MAIN_PACKAGE],
    }),
    standardTsconfig({
      options: { templateFile: "./templates/package-js/tsconfig.json" },
      includePackages: JS_PACKAGES,
    }),
    standardTsconfig({
      options: {
        file: "tsconfig.cjs.json",
        templateFile: "./templates/package/tsconfig.cjs.json",
      },
      includePackages: [...TS_PACKAGES, MAIN_PACKAGE],
    }),
    standardTsconfig({
      options: {
        file: "tsconfig.cjs.json",
        templateFile: "./templates/package-js/tsconfig.cjs.json",
      },
      includePackages: JS_PACKAGES,
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
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Example of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "turf.min.js"],
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
      includePackages: [MAIN_PACKAGE],
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
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),

    // packageEntry({
    //   options: {
    //     entries: {
    //       exports: {
    //         ".": {
    //           types: "./index.ts",
    //           default: "./index.ts",
    //         },
    //       },
    //     },
    //   },
    //   includePackages: [...TS_PACKAGES],
    // }),

    // packageEntry({
    //   options: {
    //     entries: {
    //       exports: {
    //         ".": {
    //           types: "./index.d.ts",
    //           default: "./index.js",
    //         },
    //       },
    //     },
    //   },
    //   includePackages: [...JS_PACKAGES],
    // }),

    packageEntry({
      options: {
        entries: {
          files: ["dist"],
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
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
          test: "pnpm run /test:.*/",
        },
      },
      excludePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          build: "pnpm run /build:.*/",
          "build:cjs": "tsc -b tsconfig.cjs.json",
          "build:esm": "tsc -b",
          "cjs-package-json": "",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES, MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          rollup: "rollup -c rollup.config.js",
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          bench: "tsx bench.ts",
          "test:tape": "tsx test.ts",
        },
      },
      includePackages: [...TS_TAPE_PACKAGES, ...JS_TAPE_PACKAGES],
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
        devDependencies: {
          benchmark: "^2.1.4",
          tape: "^5.9.0",
          tsup: "^8.4.0",
          tsx: "^4.19.4",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),

    requireDependency({
      options: {
        dependencies: {
          tslib: "^2.8.1",
        },
        devDependencies: {
          "@types/benchmark": "^2.1.5",
          "@types/tape": "^5.8.1",
          typescript: "^5.8.3",
        },
      },
      includePackages: TS_PACKAGES,
    }),

    requireDependency({
      options: {
        dependencies: {
          "@types/geojson": "^7946.0.10",
        },
      },
      includePackages: [MAIN_PACKAGE, ...TS_PACKAGES, ...JS_PACKAGES],
    }),
  ],
};
