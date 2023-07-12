import esbuild from "esbuild";

const typescript = {
    root: "scripts/",
    entries: ["devpool-claims/index.ts", "audit-report/audit.ts", "onboarding/onboarding.ts", "key-generator/keygen.ts"],
  },
  css = {
    root: "styles/",
    entries: ["devpool-claims/devpool-claims.css", "audit-report/audit.css", "onboarding/onboarding.css"],
  };

const entryPoints = [
  ...typescript.entries.map(entry => prependCommonRoot(typescript.root, entry)),
  ...css.entries.map(entry => prependCommonRoot(css.root, entry)),
];

export let esBuildContext = {
  sourcemap: true,
  entryPoints: entryPoints.map(entry => prependCommonRoot("static/", entry)),
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
  outdir: "static/out",
} as esbuild.BuildOptions;

function prependCommonRoot(commonRoot: string, entry: string) {
  return commonRoot + entry;
}
