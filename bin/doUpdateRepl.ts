import { execa } from "execa";
import color from "cli-color";
import { resolve, join } from "path";
import { writeFile } from "fs/promises";

const BASE_DIR = resolve(__dirname, "..");

const run = async () => {
  const viteConfigPath = join(BASE_DIR, "repl.vite.config.ts");
  await execa("npx", ["vite", "-c", viteConfigPath, "build"], {
    cwd: BASE_DIR,
    stdio: "inherit",
  });
  const imports = {
    "repl-libs": "/vueprint-components/repl/libs.es.js",
    luxon: "/vueprint-components/repl/luxon.es.js",
  };
  const headHTML = `<link rel="stylesheet" type="text/css" href="/vueprint-components/repl/style.css">`;
  const importCode = `import {VueprintComponents, VueMainBootstrap, VueClientBootstrap, VuetifyComponents, VuetifyDirectives} from 'repl-libs';`;
  const useCode = `app.use(VueprintComponents);
  app.use(VueMainBootstrap, {
    vuetify: {
      options: {
        components: VuetifyComponents,
        directives: VuetifyDirectives,
      },
    },
  });
  app.use(VueClientBootstrap, {});`;
  const vitepressReplInfoPath = join(
    BASE_DIR,
    "docs",
    ".vitepress",
    "replInfo.ts",
  );
  const vitepressReplInfoContent = `export const imports = ${JSON.stringify(imports)};\nexport const headHTML = \`${headHTML}\`;\nexport const importCode = \`${importCode}\`;\nexport const useCode = \`${useCode}\`;\n`;
  await writeFile(vitepressReplInfoPath, vitepressReplInfoContent);
  await execa("npx", ["eslint", "--fix", vitepressReplInfoPath]);
};

run().catch((error) => {
  console.error(color.red(error.message));
  console.error(error.stack.split("\n").slice(1).join("\n"));
  process.exit(1);
});
