<template>
  <span v-text="output" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeMount } from "vue";
import { useDefaults } from "vuetify";
import { DateTime } from "luxon";
import type { PropType } from "vue";
import type { Zone } from "luxon";
/**
 * A wrapper around the [Luxon DateTime toFormat method](https://moment.github.io/luxon/api-docs/index.html#datetimetoformat) which renders an input value
 * as a formatted date string according to the options.
 *
 * @module @jakguru/vueprint-components/components/formatters/VPDateTime
 * @example
 * <template>
 *  <v-app>
 *    <v-main>
 *        <v-container class="fill-height" fluid>
 *            <v-row justify="center">
 *                <v-col cols="12">
 *                  <v-row>
 *                      <v-col cols="12">
 *                          <v-card>
 *                              <v-card-text>
 *                                  The current time is: <VPDateTime />
 *                             </v-card-text>
 *                         </v-card>
 *                      </v-col>
 *                  </v-row>
 *                </v-col>
 *            </v-row>
 *        </v-container>
 *    </v-main>
 *  </v-app>
 * </template>
 */
export default defineComponent({
  name: "VPDateTime",
  props: {
    /**
     * The input date string to be formatted.
     */
    input: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The format of the input date string.
     */
    inputFormat: {
      type: String,
      default: "yyyy-MM-ddTHH:mm:ss.ZZZZ",
    },
    /**
     * The time zone of the input date string.
     */
    inputZone: {
      type: [String, Object] as PropType<string | Zone>,
      default: "local",
    },
    /**
     * Whether to set the time zone of the input date string.
     */
    inputSetZone: {
      type: Boolean,
      default: false,
    },
    /**
     * The locale of the input date string.
     */
    inputLocale: {
      type: String,
      default: "en-US",
    },
    /**
     * The numbering system of the input date string.
     */
    inputNumberingSystem: {
      type: String,
      default: "latn",
    },
    /**
     * The output calendar of the input date string.
     */
    inputOutputCalendar: {
      type: String,
      default: "gregory",
    },
    /**
     * The format of the output date string.
     */
    outputFormat: {
      type: [Object] as PropType<Intl.DateTimeFormatOptions>,
      default: DateTime.DATETIME_FULL,
    },
    /**
     * The time zone of the output date string.
     */
    outputTimeZone: {
      type: [String, Object] as PropType<string | Zone>,
      default: "local",
    },
    /**
     * The locale of the output date string.
     */
    outputLocale: {
      type: String,
      default: "en-US",
    },
    /**
     * The numbering system of the output date string.
     */
    outputNumberingSystem: {
      type: String,
      default: "latn",
    },
    /**
     * The output calendar of the output date string.
     */
    outputOutputCalendar: {
      type: String,
      default: "gregory",
    },
  },
  setup(props) {
    const input = computed(() => props.input);
    const opts = useDefaults(props, "VPDateTime");
    const inputFormat = computed(
      () => opts.inputFormat || "yyyy-MM-ddTHH:mm:ss.ZZZZ",
    );
    const inputZone = computed(() => opts.inputZone);
    const inputSetZone = computed(() => opts.inputSetZone);
    const inputLocale = computed(() => opts.inputLocale);
    const inputNumberingSystem = computed(() => opts.inputNumberingSystem);
    const inputOutputCalendar = computed(() => opts.inputOutputCalendar);
    const now = ref<DateTime | undefined>(undefined);
    const dto = computed(() => {
      if (input.value !== undefined) {
        return DateTime.fromFormat(input.value, inputFormat.value, {
          zone: inputZone.value,
          setZone: inputSetZone.value,
          locale: inputLocale.value,
          numberingSystem: inputNumberingSystem.value,
          outputCalendar: inputOutputCalendar.value,
        });
      } else if (now.value !== undefined) {
        return now.value;
      } else {
        return DateTime.now();
      }
    });
    const updateNowIfNoInput = () => {
      if (input.value === undefined) {
        now.value = DateTime.now();
      }
    };
    let checkInterval: NodeJS.Timeout | undefined;
    onMounted(() => {
      updateNowIfNoInput();
      checkInterval = setInterval(updateNowIfNoInput, 10);
    });
    onBeforeMount(() => {
      if (checkInterval !== undefined) {
        clearInterval(checkInterval);
      }
    });
    const outputFormat = computed(() => opts.outputFormat);
    const outputTimeZone = computed(() => opts.outputTimeZone);
    const outputLocale = computed(() => opts.outputLocale);
    const outputNumberingSystem = computed(() => opts.outputNumberingSystem);
    const outputOutputCalendar = computed(() => opts.outputOutputCalendar);
    const output = computed(() => {
      return dto.value
        .setZone(outputTimeZone.value)
        .toLocaleString(outputFormat.value, {
          locale: outputLocale.value,
          numberingSystem: outputNumberingSystem.value,
          outputCalendar: outputOutputCalendar.value,
        });
    });
    return {
      output,
    };
  },
});
</script>
