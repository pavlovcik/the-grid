import esbuild from "esbuild";
import { esBuildContext, _static } from "./esbuild-config";

(async function server() {
  const context = await esbuild.context(esBuildContext);
  const { host, port } = await context.serve({
    servedir: _static.dist,
    port: 8080,
  });
  await context.watch();
  console.log(`Server running on http://${host}:${port}`);
})();
