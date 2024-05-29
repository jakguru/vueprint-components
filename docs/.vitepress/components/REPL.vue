<template>
  <v-card :height="height" tile>
    <!-- @vue-expect-error Repl typedefs don't match what it actually accepts -->
    <Repl v-bind="bindings" />
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import { Repl, useStore, useVueImportMap } from "@vue/repl";
import CodeMirror from "@vue/repl/codemirror-editor";
import { useData } from "vitepress";
import { imports, headHTML, importCode, useCode } from "../replInfo";
import { defaultTemplate } from "../replConstants";
import { pascalCase } from "change-case";
import type { PropType, WatchStopHandle } from "vue";
export default defineComponent({
  name: "REPL",
  components: { Repl },
  props: {
    height: {
      type: [String, Number],
      default: "500px",
    },
    content: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    fileName: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const content = computed(() => props.content);
    const fileName = computed(() => props.fileName);
    const editorFileName = computed(() =>
      content.value
        ? fileName.value
          ? `${pascalCase(fileName.value)}.vue`
          : "Example.vue"
        : "App.vue",
    );
    const editorFileContent = computed(() =>
      content.value ? atob(content.value) : defaultTemplate,
    );
    const {
      importMap: builtinImportMap,
      vueVersion,
      productionMode,
    } = useVueImportMap();

    const store = useStore({
      builtinImportMap: ref({
        imports: {
          ...builtinImportMap.value.imports,
          ...imports,
        },
      }),
      vueVersion,
    });

    const updateReplContent = () => {
      store.setFiles(
        {
          [editorFileName.value]: editorFileContent.value,
        },
        editorFileName.value,
      );
    };

    productionMode.value = true;
    const vitePressData = useData();
    const bindings = computed(() => ({
      store,
      editor: CodeMirror,
      showCompileOutput: false,
      showTsConfig: false,
      showImportMap: false,
      clearConsole: false,
      theme: vitePressData.isDark.value ? "dark" : "light",
      previewOptions: {
        headHTML,
        customCode: {
          importCode,
          useCode,
        },
      },
    }));
    let stopWatchingContent: WatchStopHandle | undefined;
    onMounted(() => {
      updateReplContent();
      stopWatchingContent = watch(() => content.value, updateReplContent);
    });
    onBeforeUnmount(() => {
      stopWatchingContent?.();
    });
    return { bindings };
  },
});
</script>

<style lang="scss">
.vue-repl {
  .editor-container,
  .output-container {
    .editor {
      height: 100%;
    }
  }
}
</style>
