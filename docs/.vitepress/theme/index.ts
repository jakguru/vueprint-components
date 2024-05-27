// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
// @ts-expect-error this referes to itself, so of course there's no type defintions yet
import Components from "@jakguru/vueprint-components";
import VueMainBootstrap from "@jakguru/vueprint/plugins/main";
import VueClientBootstrap from "@jakguru/vueprint/plugins/client";
import * as vuetifyComponents from "vuetify/components";
import * as vuetifyDirectives from "vuetify/directives";
import "@jakguru/vueprint/vueprint.css";
import "./styles.scss";
import type { App } from "vue";

export default {
  ...DefaultTheme,
  async enhanceApp({ app }: { app: App }) {
    app.use(Components);
    // @ts-expect-error no idea why this is not working
    app.use(VueMainBootstrap, {
      vuetify: {
        options: {
          components: vuetifyComponents,
          directives: vuetifyDirectives,
        },
      },
    });
    app.use(VueClientBootstrap, {});
  },
};
