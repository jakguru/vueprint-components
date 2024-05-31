<template>
  <div class="vp-model-list-table">
    <v-card :color="backgroundColor" flat tile>
      <!-- @vue-expect-error v-data-table-server typedefs don't match what it actually accepts -->
      <v-data-table-server
        v-bind="serverDataTableBind"
        v-model="serverDataTableSelections"
        v-model:items-per-page="tableItemsPerPage"
        @update:options="onOptionsChanged"
      >
        <template #top>
          <!-- @slot The area before the table's header row -->
          <slot name="pre-header" />
          <v-toolbar v-bind="serverDataTableHeaderBindings">
            <!-- @slot The area before any content in the header toolbar -->
            <slot name="header-prepend" />
          </v-toolbar>
          <v-divider />
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useDefaults } from "vuetify";
import type { PropType, ComputedRef } from "vue";

interface ModelListTableSearchChoice {
  text: string;
  value: string;
}

interface ModelListTableColumnDefinition {
  property: string;
  title: string;
  alignment?: "start" | "end" | "center" | undefined;
  width?: string | number | undefined;
  minWidth?: string | undefined;
  maxWidth?: string | undefined;
  sortable?: boolean | undefined;
  textFormatter?: (value: any) => string;
  onClick?: (item: any) => void;
  onContextMenu?: (item: any) => void;
  displayComponent?: string;
  displayComponentBinder?: (item: any) => ComputedRef<Record<string, any>>;
  searchable?: boolean;
  searchType?:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "time"
    | "select"
    | "multiselect"
    | "combobox"
    | "multicombobox";
  choicesLoader?: (term: string) => Promise<ModelListTableSearchChoice[]>;
}
/**
 * The `vp-model-list-table` component is used to render a searchable table of items with similar attributes. Its key features include:
 * * Simple & Advanced Searching
 * * Multi-Level Sorting
 * * Pagination
 * * Item Actions
 * * Bulk Actions
 *
 * @module @jakguru/vueprint-components/components/forms/VPModelListTable
 * @example
 * <template>
 *  <v-app>
 *    <v-main>
 *        <v-container class="fill-height" fluid>
 *            <v-row justify="center">
 *                <v-col cols="12">
 *                  <v-row>
 *                      <v-col cols="12">
 *                          <VPModelListTable :columns="columns" />
 *                      </v-col>
 *                  </v-row>
 *                </v-col>
 *            </v-row>
 *        </v-container>
 *    </v-main>
 *  </v-app>
 * </template>
 *
 * <script setup>
 * import { computed } from 'vue';
 * import { DateTime } from 'luxon';
 * const habitatsDisplayComponentBinder = (item) => computed(() => ({
 *  items: item.habitats.map((h) => ({ text: h, value: h })),
 * }));
 * const createdAtDisplayComponentBinder = (item) => computed(() => ({
 *  input: item.created_at,
 *  inputFormat: 'yyyy-MM-ddTHH:mm:ss.ZZZZ',
 *  outputFormat: DateTime.DATETIME_SHORT
 * }));
 * const columns = [
 *  { property: 'id', title: 'ID' },
 *  { property: 'name', title: 'Name' },
 *  { property: 'species', title: 'Species' },
 *  { property: 'diet', title: 'Diet' },
 *  { property: 'habitats', title: 'Habitats', searchType: 'multiselect', displayComponent: 'VPChipGroup', displayComponentBinder: habitatsDisplayComponentBinder },
 *  { property: 'extinct', title: 'Extinct' },
 *  { property: 'endangered', title: 'Endangered' },
 *  { property: 'created_at', title: 'Added', alignment: 'end', displayComponent: 'VPDateTime', displayComponentBinder: createdAtDisplayComponentBinder },
 * ];
 * <\/script>
 */
export default defineComponent({
  name: "VPModelListTable",
  props: {
    /**
     * The columns to display in the table.
     * @default []
     */
    columns: {
      type: Array as PropType<ModelListTableColumnDefinition[]>,
      default: () => [],
    },
    /**
     * The background color of the table. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    backgroundColor: {
      type: String as PropType<string>,
      default: "surface",
    },
    /**
     * The background color of the table's header section. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    headerBackgroundColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The density of the table's header toolbar. Can be `default`, `prominent`, `comfortable`, `compact`
     * @values `default`, `prominent`, `comfortable`, `compact`
     */
    headerDensity: {
      type: String as PropType<
        "default" | "prominent" | "comfortable" | "compact"
      >,
      default: "default",
    },
    /**
     * Designates an elevation applied to the table header toolbar between 0 and 24. You can find more information in the [Vuetify elevation documentation](https://vuetifyjs.com/en/styles/elevation/).
     */
    headerElevation: {
      type: [Number, String] as PropType<number | string>,
      default: 0,
    },
    /**
     * Removes the box shadow from the table header toolbar.
     */
    headerFlat: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    /**
     * The height of the table's header toolbar.
     */
    headerHeight: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined,
    },
    /**
     * The image to display in the table's header toolbar.
     */
    headerImage: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The theme to apply to the table's header toolbar.
     */
    headerTheme: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const propsWithDefaults = useDefaults(props, "VPModelListTable");
    const onOptionsChanged = async (options: any) => {
      console.log("options", options);
    };
    const columns = computed(() =>
      [...propsWithDefaults.columns].map((c) =>
        Object.assign(
          {
            sortable: true,
            searchable: true,
            searchType: "string",
          },
          c,
        ),
      ),
    );
    const showLoading = computed(() => false);
    const serverDataTableSelections = ref<any[]>([]);
    const tableItemsPerPage = ref(10);
    const totalItemsCount = ref(0);
    const serverDataTableProps = useDefaults({}, "VDataTableServer");
    const serverDataTableBind = computed(() => ({
      ...serverDataTableProps,
      headers: [
        ...[...columns.value].map((c) => ({
          key: c.property,
          value: c.property,
          title: c.title,
          align: c.alignment,
          width: c.width,
          minWidth: c.minWidth,
          maxWidth: c.maxWidth,
          nowrap: true,
          sortable: c.sortable,
        })),
      ],
      items: [],
      itemsLength: totalItemsCount.value,
      loading: showLoading.value,
    }));
    const serverDataTableHeaderBindings = useDefaults(
      {
        color:
          propsWithDefaults.headerBackgroundColor ||
          propsWithDefaults.backgroundColor,
        density: propsWithDefaults.headerDensity,
        elevation: propsWithDefaults.headerElevation,
        flat: propsWithDefaults.headerFlat,
        height: propsWithDefaults.headerHeight,
        image: propsWithDefaults.headerImage,
        theme: propsWithDefaults.headerTheme,
      },
      "VToolBar",
    );
    return {
      serverDataTableBind,
      serverDataTableSelections,
      tableItemsPerPage,
      onOptionsChanged,
      serverDataTableHeaderBindings,
    };
  },
});
</script>

<style lang="scss">
.vp-model-list-table {
  max-width: 100%;
  overflow-x: auto;

  .v-table {
    background: inherit;
    color: inherit;
  }
}
</style>
