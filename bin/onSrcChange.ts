import { readdirSync, statSync, existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolve, sep } from "path";
import color from "cli-color";
import yaml from "yaml";

import type { DefaultTheme } from "vitepress/theme";

const BASE_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(BASE_DIR, "src");
const DOCUMENTABLE_TYPES = ["ts", "vue", "scss"];

interface DocumentableFileInformation {
  documentable: boolean;
  source: string;
  filename: string;
  extension: string;
  title: string;
  link: string;
  path: string;
}

const resolveDocumentableFileInformation = async (
  dir: string,
): Promise<any> => {};

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
    } else {
    }
  }
  return ret;
};

const run = async () => {
  const sidebar: DefaultTheme.Sidebar = await recursiveBuildSidebar(SRC_DIR);

  console.log(JSON.stringify(sidebar, null, 2));
};

run().catch((error) => {
  console.error(color.red(error.message));
  process.exit(1);
});
