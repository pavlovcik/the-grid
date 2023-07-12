import esbuild from "esbuild";
import { esBuildContext } from "./esbuild-config";

(async function server() {
  const context = await esbuild.context(esBuildContext);
  return await context.serve({
    servedir: "static",
    port: 8080,
  });
})();
