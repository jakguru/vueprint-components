// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
// @ts-expect-error this referes to itself, so of course there's no type defintions yet
import Components from "@jakguru/vueprint-components";
import VueMainBootstrap from "@jakguru/vueprint/plugins/main";
import VueClientBootstrap from "@jakguru/vueprint/plugins/client";
import * as vuetifyComponents from "vuetify/components";
import * as vuetifyDirectives from "vuetify/directives";
import "@jakguru/vueprint/vueprint.css";
import "sweetalert2/src/sweetalert2.scss";
import "./styles.scss";
import type { App } from "vue";

import PropsTable from "../components/PropsTable.vue";
import EventsTable from "../components/EventsTable.vue";
import SlotsTable from "../components/SlotsTable.vue";
import MethodsTable from "../components/MethodsTable.vue";

export default {
  ...DefaultTheme,
  async enhanceApp({ app }: { app: App }) {
    app.component("PropsTable", PropsTable);
    app.component("EventsTable", EventsTable);
    app.component("SlotsTable", SlotsTable);
    app.component("MethodsTable", MethodsTable);
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
