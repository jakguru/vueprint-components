<template>
  <span v-text="output" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useDefaults } from "vuetify";
import numeral from "numeral";
import type { PropType } from "vue";
/**
 * A wrapper around the [numeral library](http://numeraljs.com/) which renders an input value
 * as a formatted number string according to the options.
 * @module @jakguru/vueprint-components/components/formatters/VPNumeral
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
 *                                  There are <VPNumeral :input="1000" format="0,0" /> items in the list.
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
  name: "VPNumeral",
  props: {
    /**
     * The input number to be formatted.
     */
    input: {
      type: Number as PropType<number | undefined>,
      required: true,
    },
    /**
     * The format of the input number.
     */
    format: {
      type: String,
      default: "0,0",
    },
  },
  setup(props) {
    const opts = useDefaults(props, "VPNumeral");
    const input = computed(() => props.input);
    const format = computed(() => opts.format);
    const output = computed(() => {
      return numeral(input.value).format(format.value);
    });
    return { output };
  },
});
</script>
