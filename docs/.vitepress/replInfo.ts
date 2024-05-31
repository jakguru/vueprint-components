export const imports = {
  "repl-libs": "/vueprint-components/repl/libs.es.js",
  luxon: "/vueprint-components/repl/luxon.es.js",
};
export const headHTML = `<link rel="stylesheet" type="text/css" href="/vueprint-components/repl/style.css">`;
export const importCode = `import {VueprintComponents, VueMainBootstrap, VueClientBootstrap, VuetifyComponents, VuetifyDirectives} from 'repl-libs';`;
export const useCode = `app.use(VueprintComponents);
  app.use(VueMainBootstrap, {
    vuetify: {
      options: {
        components: VuetifyComponents,
        directives: VuetifyDirectives,
      },
    },
  });
  app.use(VueClientBootstrap, {});`;
