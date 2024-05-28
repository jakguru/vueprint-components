<template>
  <ReferenceTable :decoded="decoded" :columns="columns" for="Slots" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import ReferenceTable from "./ReferenceTable.vue";
export default defineComponent({
  name: "SlotsTable",
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
      { title: "Name", key: "name" },
      { title: "Description", key: "description" },
      { title: "Bindings", key: "bindings" },
    ]);
    const encoded = computed(() => props.encoded);
    const decoded = computed(() =>
      [...JSON.parse(atob(encoded.value))]
        .map((p) => ({
          ...p,
        }))
        .filter((p) => p.name !== "slot"),
    );
    return { columns, decoded };
  },
});
</script>
