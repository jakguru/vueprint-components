/**
 * Process which uses nodemon to check for changes to source code and updates the documentation files accordingly.
 * Also runs and monitors the vitepress dev server
 */
import { execa } from 'execa';
import color from 'cli-color'
const nodemon = require('nodemon');

const nodemonConfig = {
    "watch": [
        "src/**/*",
        "bin/onSrcChange.ts",
        "package.json"
    ],
    "ext": "ts,json,env,scss,vue",
    "ignore": [
        "node_modules",
    ],
    "exec": "npx jiti bin/onSrcChange.ts"
}

nodemon(nodemonConfig);
nodemon.on('start', function () {
    console.log(color.green('Dev Process has started'));
  }).on('quit', function () {
    console.log(color.red('Dev Process has quit'));
    process.exit();
  }).on('restart', function (files: string[]) {
    console.log('App restarted due to: ', files);
  });
const vitepressDevServer = execa('npx', ['vitepress', 'dev', 'docs'], {
    stdio: 'inherit'
});
vitepressDevServer.catch((err) => {
    console.error(err.message);
    process.exit(1);
}).finally(() => {
    console.log('Vitepress Dev Server has quit');
    process.exit();
});