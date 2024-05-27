import { defineConfig } from "vitepress";
import { transformAssetUrls } from "vite-plugin-vuetify";
import { resolve } from "path";
import sidebar from "./sidebar";

export default defineConfig({
  base: "/vueprint-components/",
  lang: "en-US",
  title: "VuePrint Components",
  description: "Reusable Vue Components for VuePrint",
  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        href: "/favicons/apple-touch-icon-57x57.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        href: "/favicons/apple-touch-icon-60x60.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        href: "/favicons/apple-touch-icon-72x72.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        href: "/favicons/apple-touch-icon-76x76.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        href: "/favicons/apple-touch-icon-114x114.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/favicons/apple-touch-icon-120x120.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        href: "/favicons/apple-touch-icon-144x144.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/favicons/apple-touch-icon-152x152.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicons/apple-touch-icon-180x180.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicons/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/favicons/android-chrome-192x192.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicons/favicon-16x16.png",
      },
    ],
    // ["link", { rel: "manifest", href: "/favicons/site.webmanifest" }],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/favicons/safari-pinned-tab.svg",
        color: "#227fb9",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#227fb9" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
  ],
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Getting Started", link: "/guide/" }],
      },
      ...sidebar,
      {
        text: "Bugs & Issues",
        link: "https://github.com/jakguru/vueprint-components/issues",
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/jakguru/vueprint" },
      { icon: "npm", link: "https://www.npmjs.com/package/@jakguru/vueprint" },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message:
        "Vueprint Components are a commercial work product released under the MIT License and is provided as-is with no warranty or guarantee of support.",
      copyright: "Copyright © 2024-present Jak Guru LLC",
    },

    outline: {
      level: [2, 4],
    },
  },
  markdown: {
    toc: {
      level: [2, 3, 4],
    },
  },
  vite: {
    resolve: {
      alias: {
        "@jakguru/vueprint-components": resolve(__dirname, "../../src"),
      },
      dedupe: ["vue", "vuetify", "@jakguru/vueprint"], // avoid error when using dependencies that also use Vue
    },
  },
  vue: {
    template: {
      transformAssetUrls,
    },
  },
});
