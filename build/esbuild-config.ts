import esbuild from "esbuild";

//

const _static = {
  src: "src/",
  dist: "dist/",
};

const scripts = {
    root: "scripts/",
    entries: [
      "index.ts"
      // "devpool-claims/index.ts", "audit-report/audit.ts", "onboarding/onboarding.ts", "key-generator/keygen.ts"
    ],
  },
  styles = {
    root: "styles/",
    entries: [
      // "devpool-claims/devpool-claims.css", "audit-report/audit.css", "onboarding/onboarding.css"
    ],
  };

//

const entries = [
  ...scripts.entries.map(entry => prependCommonRoot(scripts.root, entry)),
  ...styles.entries.map(entry => prependCommonRoot(styles.root, entry)),
];

export let esBuildContext = {
  sourcemap: true,
  entryPoints: entries.map(entry => prependCommonRoot(_static.src, entry)),
  bundle: true,
  minify: false,
  loader: {
    ".png": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".eot": "dataurl",
    ".ttf": "dataurl",
    ".svg": "dataurl",
  },
  outdir: _static.dist,
} as esbuild.BuildOptions;

function prependCommonRoot(commonRoot: string, entry: string) {
  return commonRoot + entry;
}
