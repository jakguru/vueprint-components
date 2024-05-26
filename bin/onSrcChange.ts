import { readdirSync, statSync, existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolve, sep } from "path";
import color from "cli-color";
import yaml from "yaml";

import type { DefaultTheme } from "vitepress/theme";

const BASE_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(BASE_DIR, "src");
const DOCUMENTABLE_TYPES = ["ts", "vue", "scss"];

const recursiveListFiles = (dir: string) => {
  const sources = new Set<string>();
  const contents = readdirSync(dir);
  contents.forEach((item) => {
    const itemPath = resolve(dir, item);
    const itemStat = statSync(itemPath);
    if (itemStat.isDirectory()) {
      const subSources = recursiveListFiles(itemPath);
      subSources.forEach((subItem) => sources.add(subItem));
    } else {
      sources.add(itemPath);
    }
  });
  return [...sources] as string[];
};

const recursiveListFilesRelative = (dir: string) => {
  return recursiveListFiles(dir).map((item) => item.replace(SRC_DIR + "/", ""));
};

const sources = recursiveListFilesRelative(SRC_DIR);
const documentable = sources.filter((source) => {
  const pathParts = source.split(sep);
  const fileName = pathParts[pathParts.length - 1];
  const fileParts = fileName.split(".");
  fileParts.shift();
  const extension = fileParts.join(".");
  return (
    DOCUMENTABLE_TYPES.includes(extension) &&
    !fileName.startsWith("_") &&
    !fileName.startsWith(".") &&
    !fileName.endsWith("index.ts")
  );
});

const run = async () => {
  console.log(
    color.blue(
      `Processing ${documentable.length} documentable ${documentable.length === 1 ? "file" : "files"}`,
    ),
  );
  const promises: Promise<void>[] = [];
  const sections: Record<string, DefaultTheme.SidebarItem> = {};
  const sidebar: DefaultTheme.Sidebar = [];
  const getHasIndexYml = (folderParts: string[]) => {
    const folder = folderParts.join(sep);
    const indexPath = resolve(SRC_DIR, folder, "index.yml");
    if (existsSync(indexPath)) {
      return indexPath;
    }
  };
  const getSectionForFolder = async (folder: string) => {
    const folderParts = folder.split(sep);
    let indexYml = getHasIndexYml(folderParts);
    while (folderParts.length && !indexYml) {
      folderParts.pop();
      indexYml = getHasIndexYml(folderParts);
    }
    if (indexYml) {
      const yamlRaw = await readFile(indexYml, "utf-8");
      const index = yaml.parse(yamlRaw);
      const { title, expanded } = index;
      return { text: title, collapsed: !expanded, items: [] };
    }
  };
  const getDocumentableName = async (
    source: string,
    filename: string,
    extension: string,
  ) => {
    if (extension === "vue") {
      return filename.replace(".vue", "");
    }
    const filePath = resolve(SRC_DIR, source);
    return filename;
  };
  // Create the sidebar from the documentable files
  const forDocumentable = async (source: string) => {
    const pathParts = source.split(sep);
    const fileName = pathParts.pop()!;
    const fileParts = fileName.split(".");
    fileParts.shift();
    const extension = fileParts.join(".");
    const folder = pathParts.join(sep);
    const sectionForFolder = await getSectionForFolder(folder);
    const folderKey = folder.split(sep).join(".");
    if (sectionForFolder) {
      const name = await getDocumentableName(source, fileName, extension);
      if (!sections[folderKey]) {
        sections[folderKey] = sectionForFolder;
      }
      sections[folderKey].items!.push({
        text: name,
        link: "/" + [folder, fileName.replace(`.${extension}`, "")].join("/"),
      });
    }
  };
  documentable.forEach((source) => promises.push(forDocumentable(source)));
  await Promise.all(promises);

  console.log(sections);
};

run().catch((error) => {
  console.error(color.red(error.message));
  process.exit(1);
});
