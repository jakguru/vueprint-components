import { readdirSync, statSync, existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve, sep } from "path";
import color from "cli-color";
import yaml from "yaml";
import { execa } from "execa";

import type { DefaultTheme } from "vitepress/theme";

const BASE_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(BASE_DIR, "src");
const DOCUMENTABLE_TYPES = ["ts", "vue", "scss"];

interface DocumentableFileInformation {
  documentable: boolean;
  source: string;
  relsource: string;
  filename: string;
  extension: string;
  title: string;
  link: string;
  path: string;
}

const getDocumentableTitle = async (
  source: string,
  filename: string,
  extension: string,
) => {
  if (extension === "vue") {
    return filename.replace(".vue", "");
  }
  const filePath = resolve(SRC_DIR, source);
  if (extension === "scss") {
    const docSource = `${filePath}.md`;
    const docContent = await readFile(docSource, "utf8");
    const titleMatch = docContent.match(/^# (.+)$/m);
    if (titleMatch) {
      return titleMatch[1];
    }
  }
  return filename;
};

const resolveDocumentableFileInformation = async (
  source: string,
): Promise<DocumentableFileInformation> => {
  const relsource = source.replace(SRC_DIR, "");
  const filename = source.split(sep).pop() as string;
  const extension = filename.split(".").pop() as string;
  let documentable = DOCUMENTABLE_TYPES.includes(extension);
  if (documentable && "ts" === extension && filename.includes(".d.ts")) {
    documentable = false;
  }
  if (documentable && "scss" === extension) {
    const docSource = `${source}.md`;
    documentable = existsSync(docSource);
  }
  if (documentable && `index.${extension}` === filename) {
    documentable = false;
  }
  const link = relsource
    .replace(new RegExp(`\\${sep}`, "g"), "/")
    .replace(new RegExp(`\\.${extension}$`), "");
  const path = relsource.replace(new RegExp(`\\.${extension}$`), ".md");
  const title = documentable
    ? await getDocumentableTitle(source, filename, extension)
    : filename.replace(new RegExp(`\\.${extension}$`), "");
  return {
    documentable,
    source,
    relsource,
    filename,
    extension,
    title,
    link,
    path,
  };
};

const recursiveBuildSidebar = async (
  dir: string,
): Promise<DefaultTheme.Sidebar> => {
  const contents = readdirSync(dir);
  const ret: DefaultTheme.Sidebar = [];
  for (let i = 0; i < contents.length; i++) {
    const item = contents[i];
    const itemPath = resolve(dir, item);
    const itemStat = statSync(itemPath);
    if (itemStat.isDirectory()) {
      // if the index.yml file exists, then { items: [ ...recursiveBuildSidebar(itemPath) ] },
      // otherwise, ...recursiveBuildSidebar(itemPath)
      const indexYmlPath = resolve(itemPath, "index.yml");
      if (existsSync(indexYmlPath)) {
        const indexYml = yaml.parse(await readFile(indexYmlPath, "utf8"));
        const subItems = await recursiveBuildSidebar(itemPath);
        if (Array.isArray(subItems)) {
          ret.push({
            text: indexYml.title,
            items: [...subItems],
            collapsed: !indexYml.expanded,
          });
        }
      } else {
        const subItems = await recursiveBuildSidebar(itemPath);
        if (Array.isArray(subItems)) {
          ret.push(...subItems);
        }
      }
    } else {
      const iInfo = await resolveDocumentableFileInformation(itemPath);
      if (iInfo.documentable) {
        ret.push({
          text: iInfo.title,
          link: iInfo.link,
        });
      }
    }
  }
  return ret;
};

const run = async () => {
  const sidebar: DefaultTheme.Sidebar = await recursiveBuildSidebar(SRC_DIR);
  const sidebarPath = resolve(BASE_DIR, "docs", ".vitepress", "sidebar.ts");
  await writeFile(
    sidebarPath,
    `export default ${JSON.stringify(sidebar, null, 2)};`,
  );
  await execa("npx", ["eslint", "--fix", sidebarPath]);
};

run().catch((error) => {
  console.error(color.red(error.message));
  process.exit(1);
});
