<template>
  <ReferenceTable :decoded="decoded" :columns="columns" for="Props" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import ReferenceTable from "./ReferenceTable.vue";
import { kebabCase } from "change-case";
export default defineComponent({
  name: "PropsTable",
  components: {
    ReferenceTable,
  },
  props: {
    encoded: {
      type: String,
      default: "W10=",
    },
  },
  setup(props) {
    const columns = computed(() => [
      { title: "Camel Case", key: "name" },
      { title: "Kebab Case", key: "kebab" },
      { title: "Description", key: "description" },
      { title: "Type", key: "type.name" },
      { title: "Default", key: "defaultValue.value" },
      { title: "Required", key: "required" },
    ]);
    const encoded = computed(() => props.encoded);
    const decoded = computed(() =>
      [...JSON.parse(atob(encoded.value))].map((p) => ({
        ...p,
        kebab: kebabCase(p.name),
      })),
    );
    return { columns, decoded };
  },
});
</script>
