import esbuild from "esbuild";

//

export const _static = {
  src: "src/",
  dist: "dist/",
};
const html = {
    root: "",
    entries: ["index.html"],
  },
  scripts = {
    root: "scripts/",
    entries: [
      "the-grid.ts",
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
  ...html.entries.map(entry => prependCommonRoot(html.root, entry)),
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
    ".html": "copy",
  },
  outdir: _static.dist,
} as esbuild.BuildOptions;

function prependCommonRoot(commonRoot: string, entry: string) {
  return commonRoot + entry;
}
