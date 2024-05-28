import { readdirSync, statSync, existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join, resolve, sep, dirname } from "path";
import color from "cli-color";
import yaml from "yaml";
import { execa } from "execa";
import { mkdirp } from "mkdirp";
import { parse } from "vue-docgen-api";
import { kebabCase } from "change-case";
import mustache from "mustache";

mustache.escape = (text: string) => text;

import type { DefaultTheme } from "vitepress/theme";

const BASE_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(BASE_DIR, "src");
const DOCUMENTABLE_TYPES = ["ts", "vue", "scss"];

let vueTemplateSrc: string | undefined;

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
  if (documentable && "ts" === extension) {
    const scssSource = source.replace(/\.ts$/, ".scss");
    documentable = !existsSync(scssSource);
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

const listFiles = (dir: string): string[] => {
  let results: string[] = [];

  const list = readdirSync(dir);
  list.forEach((file) => {
    file = resolve(dir, file);
    const stat = statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(listFiles(file));
    } else {
      results.push(file);
    }
  });

  return results;
};

const listDocumentableFiles = async (
  dir: string,
): Promise<DocumentableFileInformation[]> => {
  const files = listFiles(dir);
  const ret: DocumentableFileInformation[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const iInfo = await resolveDocumentableFileInformation(file);
    if (iInfo.documentable) {
      ret.push(iInfo);
    }
  }
  return ret;
};

const getDocForTypescript = async (source: string) => {
  return `# ${source}`;
};

const getDocForVue = async (source: string) => {
  if (!vueTemplateSrc) {
    const vueTemplateSrcPath = resolve(BASE_DIR, "templates", "vue.md");
    vueTemplateSrc = await readFile(vueTemplateSrcPath, "utf8");
  }

  const componentInfo = await parse(source, {
    validExtends: () => true,
  });

  const getComponentInfoTag = (tag: string) => {
    if (componentInfo.tags && componentInfo.tags[tag]) {
      return componentInfo.tags[tag][0] as any;
    }
  };

  const merge: Record<string, string> = {
    displayName: componentInfo.displayName,
    displayNameKebab: kebabCase(componentInfo.displayName),
  };

  if (componentInfo.description) {
    merge.description = componentInfo.description;
  }

  const moduleInfo = getComponentInfoTag("module");
  if (moduleInfo) {
    merge.module = moduleInfo.description;
  }
  const exampleInfo = getComponentInfoTag("examples");
  if (exampleInfo) {
    merge.example = exampleInfo.content.replace(/\\\//g, "/");
  } else {
    merge.example = `<template>
      <${merge.displayName} />
    </template>`;
  }
  merge.props = btoa(JSON.stringify(componentInfo.props || []));
  merge.events = btoa(JSON.stringify(componentInfo.events || []));
  merge.slots = btoa(JSON.stringify(componentInfo.slots || []));
  merge.methods = btoa(JSON.stringify(componentInfo.methods || []));
  merge.example = merge.example
    .replace(/<template>/g, '<v-container fluid class="demo-container">')
    .replace(/<\/template>/g, "</v-container>");

  merge.debug = `\`\`\`json\n${JSON.stringify(componentInfo, null, 2)}\n\`\`\`\n\n\`\`\`json\n${JSON.stringify(merge, null, 2)}\n\`\`\``;

  return mustache.render(vueTemplateSrc, merge);
};

const getDocForScss = async (source: string) => {
  const doc = `${source}.md`;
  return await readFile(doc, "utf8");
};

const updateSidebar = async () => {
  let needsUpdate = false;
  const sidebarPath = resolve(BASE_DIR, "docs", ".vitepress", "sidebar.ts");
  const sidebar: DefaultTheme.Sidebar = await recursiveBuildSidebar(SRC_DIR);
  if (!existsSync(sidebarPath)) {
    needsUpdate = true;
  } else {
    const current = await import(sidebarPath);
    if (!current.default) {
      needsUpdate = true;
    }
    if (!needsUpdate) {
      const currentAsJson = JSON.stringify(current.default);
      const sidebarAsJson = JSON.stringify(sidebar);
      needsUpdate = currentAsJson !== sidebarAsJson;
    }
  }
  if (needsUpdate) {
    await writeFile(
      sidebarPath,
      `export default ${JSON.stringify(sidebar, null, 2)};`,
    );
    await execa("npx", ["eslint", "--fix", sidebarPath]);
  }
};

const run = async () => {
  updateSidebar();

  const documentableFiles = await listDocumentableFiles(SRC_DIR);
  for (let i = 0; i < documentableFiles.length; i++) {
    const file = documentableFiles[i];
    let doc = "";
    switch (file.extension) {
      case "ts":
        doc = await getDocForTypescript(file.source);
        break;
      case "vue":
        doc = await getDocForVue(file.source);
        break;
      case "scss":
        doc = await getDocForScss(file.source);
        break;
    }
    const docPath = join(BASE_DIR, "docs", file.path);
    const docDir = dirname(docPath);
    await mkdirp(docDir);
    await writeFile(docPath, doc);
  }
};

run().catch((error) => {
  console.error(color.red(error.message));
  console.error(error.stack.split("\n").slice(1).join("\n"));
  process.exit(1);
});
