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
import * as td from "typedoc";

// import { inspect } from "util";

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
  if (documentable && filename.startsWith("_")) {
    documentable = false;
  }
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

const escapePipeForMarkdownTable = (str: string) => {
  return str.replace(/\|/g, "\\|");
}

const makeFunctionExampleFromSignatureReflection = (
  s: td.Models.SignatureReflection,
) => {
  let ret = "";
  ret += `${s.name}`;
  if (s.typeParameters) {
    ret += `<${s.typeParameters
      .map((p) => {
        let pstr = "";
        pstr += p.name;
        if (p.default) {
          pstr += ` = ${p.default}`;
        }
        return pstr;
      })
      .join(", ")}>`;
  }
  ret += `(`;
  if (s.parameters) {
    ret += s.parameters
      .map((p) => {
        let pstr = "";
        if (p.flags?.isRest) {
          pstr += `...`;
        }
        pstr += p.name;
        if (p.flags?.isOptional) {
          pstr += `?`;
        }
        pstr += `: ${p.type}`;
        return pstr;
      })
      .join(", ");
  }
  ret += `): ${s.type}`;
  return ret;
};

const getDocForTypescript = async (source: string) => {
  const app = await td.Application.bootstrap({
    entryPoints: [source],
    name: "VuePrint Components",
    includeVersion: false,
    disableSources: false,
    sourceLinkTemplate:
      "https://github.com/jakguru/vueprint-components/blob/{gitRevision}/{path}#L{line}",
    emit: "none",
    hideGenerator: true,
    visibilityFilters: {
      protected: false,
      private: false,
      inherited: true,
      external: true,
      "@alpha": false,
      "@beta": false,
    },
    sort: [
      "instance-first",
      "required-first",
      "kind",
      "visibility",
      "alphabetical",
    ],
    readme: "none",
    excludeNotDocumented: false,
    excludeExternals: false,
    excludePrivate: true,
    excludeProtected: true,
    excludeInternal: false,
    excludeReferences: false,
    externalSymbolLinkMappings: {},
  });
  const project = await app.convert();
  if (!project) {
    return `# ${source}`;
  }
  const module = source
    .replace(SRC_DIR, project.packageName!)
    .replace(/\.ts$/, "");
  // const dbg = inspect(project, { depth: 10 });
  // const dbgPath = join(BASE_DIR, "debug.txt");
  // await writeFile(dbgPath, dbg);
  let mkdown = "";
  mkdown += `# ${module}\n\n`;

  const realExports = new Set();
  const typeExports = new Set();
  const realReflectionKinds = [
    td.ReflectionKind.Variable,
    td.ReflectionKind.Function,
    td.ReflectionKind.Class,
    td.ReflectionKind.Enum,
  ];
  project.children!.forEach((child) => {
    if (realReflectionKinds.includes(child.kind)) {
      realExports.add(child.name);
    } else {
      typeExports.add(child.name);
    }
  });
  if (realExports.size || typeExports.size) {
    mkdown += `\`\`\`typescript\n`;
    if (realExports.size) {
      mkdown += `import { ${[...realExports].join(", ")} } from '${module}';\n`;
    }
    if (typeExports.size) {
      mkdown += `import type { ${[...typeExports].join(", ")} } from '${module}';\n`;
    }
  }
  mkdown += `\`\`\`\n\n`;
  project.groups!.forEach((group) => {
    mkdown += `## ${group.title}\n\n`;
    group.children.forEach((child) => {
      mkdown += `### \`${child.name}\`\n\n`;
      if (child.type) {
        mkdown += `\`\`\`typescript\n${child.type}\n\`\`\`\n\n`;
      }
      if (child.flags) {
        mkdown += `<div class="mb-2"></div>\n\n`;
        child.flags.forEach((flag) => {
          mkdown += `<v-chip size="small" label>${flag}</v-chip>`;
        });
        mkdown += "\n\n";
      }
      if (child.comment) {
        if (child.comment.summary) {
          child.comment.summary.forEach((summary) => {
            switch (summary.kind) {
              case "text":
                mkdown += `${summary.text}\n\n`;
                break;

              default:
                console.log(summary);
                break;
            }
          });
        }
        if (child.comment.blockTags) {
          child.comment.blockTags.forEach((tag) => {
            console.log(tag);
          });
        }
        // mkdown += `${child.comment.summary}\n\n`;
      }
      if (child.children) {
        mkdown += `#### Properties\n\n`;
        mkdown += `| Name | Type | Description |\n`;
        mkdown += `| ---- | ---- | ----------- |\n`;
        child.children.forEach((p) => {
          const info: any = {
            name: `\`${p.name}\``,
            type: p.type?.toString() || "",
          };
          if (p.comment) {
            if (p.comment.summary) {
              info.description = p.comment.summary
                .map((s) => {
                  switch (s.kind) {
                    case "text":
                      return s.text;
                    default:
                      console.log("p.comment.summary", s);
                      return "";
                  }
                })
                .join(" ");
            }
          }
          if (!info.description) {
            info.description = "";
          }
          mkdown += `| ${info.name} | ${info.type} | ${info.description} |\n`;
        });
      }
      if (child.signatures) {
        mkdown += `#### Signatures\n\n`;
        child.signatures.forEach((s) => {
          if (s.comment) {
            if (s.comment.summary) {
              mkdown += `${s.comment.summary
                .map((s) => {
                  switch (s.kind) {
                    case "text":
                      return s.text;
                    default:
                      console.log("s.comment.summary", s);
                      return "";
                  }
                })
                .join(" ")}\n\n`;
            }
          }
          mkdown += `\`\`\`typescript\n${makeFunctionExampleFromSignatureReflection(s)}\n\`\`\`\n\n`;
          if (s.typeParameters) {
            mkdown += `#### Type Variables\n\n`;
            mkdown += `| Name | Type | Default | Description |\n`;
            mkdown += `| ---- | ---------- | ------- | ------- |\n`;
            s.typeParameters.forEach((p) => {
              const info: any = {
                name: `\`${p.name}\``,
                type: p.type ? `\`${p.type}\`` : "",
                default: p.default ? `\`${p.default}\`` : "",
              };
              if (p.comment) {
                if (p.comment.summary) {
                  info.description = p.comment.summary
                    .map((s) => {
                      switch (s.kind) {
                        case "text":
                          return s.text;
                        default:
                          console.log("p.comment.summary", s);
                          return "";
                      }
                    })
                    .join(" ");
                }
              }
              if (!info.description) {
                info.description = "";
              }
              mkdown += `| ${escapePipeForMarkdownTable(info.name)} | ${escapePipeForMarkdownTable(info.type)} | ${escapePipeForMarkdownTable(info.default)} | ${escapePipeForMarkdownTable(info.description) } |\n`;
            });
          }
          if (s.parameters) {
            mkdown += `#### Parameters\n\n`;
            mkdown += `| Name | Type | Description |\n`;
            mkdown += `| ---- | ---- | ----------- |\n`;
            s.parameters.forEach((p) => {
              const info: any = {
                name: `\`${p.name}\``,
                type: p.type ? `\`${p.type}\`` : "",
              };
              if (p.comment) {
                if (p.comment.summary) {
                  info.description = p.comment.summary
                    .map((s) => {
                      switch (s.kind) {
                        case "text":
                          return s.text;
                        default:
                          console.log("p.comment.summary", s);
                          return "";
                      }
                    })
                    .join(" ");
                }
              }
              if (!info.description) {
                info.description = "";
              }
              mkdown += `| ${escapePipeForMarkdownTable(info.name)} | ${escapePipeForMarkdownTable(info.type)} | ${escapePipeForMarkdownTable(info.description)} |\n`;
            });
          }
        });
      }
    });
  });
  return mkdown;
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
  merge.exampleEncoded = btoa(merge.example);
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
    console.log(color.yellow("Updating Sidebar..."));
    await writeFile(
      sidebarPath,
      `export default ${JSON.stringify(sidebar, null, 2)};`,
    );
    await execa("npx", ["eslint", "--fix", sidebarPath]);
  }
};

const run = async () => {
  updateSidebar();
  console.log(color.yellow("Updating Documentation..."));
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
  console.log(color.green("Documentation Updated"));
};

run().catch((error) => {
  console.error(color.red(error.message));
  console.error(error.stack.split("\n").slice(1).join("\n"));
  process.exit(1);
});
