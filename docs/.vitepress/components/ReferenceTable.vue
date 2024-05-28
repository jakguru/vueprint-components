<template>
  <div class="reference-table">
    <v-data-table
      class="transparent"
      :headers="columns"
      :items="items"
      v-bind="bindings"
    >
      <template #item.name="{ item }">
        <code class="no-break">{{ item.name }}</code>
      </template>
      <template #item.kebab="{ item }">
        <code class="no-break">{{ item.kebab }}</code>
      </template>
      <template #item.description="{ item }">
        <div style="min-width: 300px" v-html="item.description" />
      </template>
      <template #item.type.name="{ item }">
        <code v-if="item.type">{{ item.type.name }}</code>
      </template>
      <template #item.defaultValue.value="{ item }">
        <code v-if="item.defaultValue && item.defaultValue.value">{{
          item.defaultValue.value
        }}</code>
      </template>
      <template #item.required="{ item }">
        <v-chip :color="item.required ? 'error' : 'success'">
          {{ item.required ? "Yes" : "No" }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import markdownit from "markdown-it";
import type { PropType } from "vue";
export default defineComponent({
  name: "ReferenceTable",
  props: {
    decoded: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    for: {
      type: String,
      default: "References",
    },
  },
  setup(props) {
    const md = markdownit();
    const referencesAreFor = computed(() => props.for);
    const decoded = computed(() => props.decoded);
    const bindings = computed(() => ({
      mobile: false,
      "multi-sort": true,
      "no-data-text": `No ${referencesAreFor.value.toLowerCase()} are defined directly on this component`,
    }));
    const items = computed(() =>
      [...decoded.value].map((i) => ({
        ...i,
        description: i.description ? md.render(i.description) : "",
      })),
    );
    return { bindings, items };
  },
});
</script>

<style lang="scss">
.reference-table {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition:
    border-color 0.25s,
    background-color 0.25s;
  color: var(--vp-c-text-1);
  margin-top: 2em;

  .v-table {
    background-color: transparent !important;
    color: var(--vp-c-text-1);
  }

  hr,
  .v-divider {
    height: 0;
    margin: 0;
    border-style: solid;
    border-width: thin 0 0 0;
    opacity: 1;
  }

  table {
    display: table;
    margin: 0;
    color: var(--vp-c-text-1);
    border-collapse: separate;
    text-indent: initial;
    unicode-bidi: isolate;

    tr {
      background-color: initial;
      border-top: initial;

      th,
      td {
        font-size: inherit;
        font-weight: inherit;
        border: initial;
      }
    }

    thead {
      > tr:last-child {
        > th {
          border-bottom: solid thin var(--vp-c-divider);
        }
      }
      > tr {
        > th {
          &:hover {
            color: var(--vp-c-text-1) !important;
          }
        }
      }
    }

    tbody {
      > tr:not(:last-child) {
        > td,
        > th {
          border-bottom: solid thin var(--vp-c-divider) !important;
        }
      }
    }
  }

  ul,
  ol {
    list-style: none !important;
    list-style-type: none !important;
    padding-left: 0;
    margin: 0;

    > li {
      margin-top: 0;
    }
  }

  .no-break {
    white-space: nowrap;
  }
}
</style>
