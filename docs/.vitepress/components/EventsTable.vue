<template>
  <ReferenceTable :decoded="decoded" :columns="columns" for="Events" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import ReferenceTable from "./ReferenceTable.vue";
export default defineComponent({
  name: "EventsTable",
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
      { title: "Properties", key: "properties" },
    ]);
    const encoded = computed(() => props.encoded);
    const decoded = computed(() =>
      [...JSON.parse(atob(encoded.value))].map((p) => ({
        ...p,
      })),
    );
    return { columns, decoded };
  },
});
</script>
