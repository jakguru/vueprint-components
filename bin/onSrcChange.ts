import { readdirSync, statSync } from 'fs';
import { resolve, sep } from 'path';
import color from 'cli-color';
import yaml from 'yaml';

import type { DefaultTheme } from 'vitepress/theme';

const BASE_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(BASE_DIR, 'src');
const DOCUMENTABLE_TYPES = ['ts', 'vue', 'scss'];

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
    return recursiveListFiles(dir).map((item) => item.replace(SRC_DIR + '/', ''));
}

const sources = recursiveListFilesRelative(SRC_DIR);
const documentable = sources.filter((source) => {
    const pathParts = source.split(sep);
    const fileName = pathParts[pathParts.length - 1];
    const fileParts = fileName.split('.');
    fileParts.shift();
    const extension = fileParts.join('.');
    return DOCUMENTABLE_TYPES.includes(extension) && !fileName.startsWith('_') && !fileName.startsWith('.') && !fileName.endsWith('index.ts');
});

const run = async () => {
    console.log(color.blue(`Processing ${documentable.length} documentable ${documentable.length === 1 ? 'file' : 'files'}`));
    const promises: Promise<void>[] = [];
    const sidebar: DefaultTheme.Sidebar = [];
    // Create the sidebar from the documentable files
    const forDocumentable = async (source: string) => {
        const pathParts = source.split(sep);
        const fileName = pathParts.pop()!;
        const fileParts = fileName.split('.');
        fileParts.shift();
        const extension = fileParts.join('.');
        console.log({ pathParts, fileName, extension });
    };
    documentable.forEach(source => promises.push(forDocumentable(source)));
}

run().catch((error) => {
    console.error(color.red(error.message));
    process.exit(1);
});