<template>
  <v-text-field
    readonly
    :model-value="value"
    hide-details
    append-inner-icon="mdi-content-copy"
    v-bind="bound"
    @click:append-inner="copy"
  >
    <template v-for="(_, slot) of $slots" #[slot]="scope"
      ><slot :name="slot" v-bind="scope"
    /></template>
  </v-text-field>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { VTextField } from "vuetify/components/VTextField";
import { useClipboard } from "@vueuse/core";
import { useDefaults } from "vuetify";
import { getDebugger } from "@jakguru/vueprint/utilities/debug";

const debug = getDebugger("VPTextFieldCopyable");

const toSkip = [
  "readonly",
  "value",
  "model-value",
  "modelValue",
  "hide-details",
  "append-inner-icon",
  "hideDetails",
  "appendInnerIcon",
  "onClick:prependInner",
];
const makeProps = (additional: any = {}) => {
  const props: any = {};
  for (const key in VTextField.props) {
    if (toSkip.includes(key)) {
      continue;
    }
    props[key] = VTextField.props[key];
  }
  return {
    ...props,
    ...additional,
  };
};
/**
 * The `vp-text-field-copyable` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:
 *
 * * A copy button that copies the value of the text field to the clipboard
 *
 * ::: info Important Note
 * This component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.
 * :::
 *
 * ::: info Tip
 * This component is compatible with the [Vuetify Global Configuration](https://vuetifyjs.com/en/features/global-configuration/) API.
 * :::
 *
 * @module @jakguru/vueprint-components/components/fields/VPPasswordField
 * @example
 * <template>
 *  <v-app>
 *    <v-main>
 *        <v-container class="fill-height" fluid>
 *            <v-row justify="center">
 *                <v-col cols="12">
 *                    <v-card>
 *                        <v-container>
 *                            <v-row>
 *                                <v-col cols="12">
 *                                    <VPTextFieldCopyable value="Example Value" label="Example Copyable Text Field" @copied="$toast.fire({ icon: 'success', title: 'Copied' })" @copy-failed="$toast.fire({ icon: 'error', title: 'Failed to Copy' })" />
 *                                </v-col>
 *                            </v-row>
 *                        </v-container>
 *                    </v-card>
 *                </v-col>
 *            </v-row>
 *        </v-container>
 *    </v-main>
 *  </v-app>
 * </template>
 */
export default defineComponent({
  name: "VPTextFieldCopyable",
  props: makeProps({
    /**
     * The value to be copied to the clipboard
     * @model
     */
    value: {
      type: String,
      default: "",
    },
  }),
  emits: [
    /**
     * Emitted when the value is successfully copied to the clipboard
     *
     * @property {string} value - The value that was copied
     */
    "copied",
    /**
     * Emitted when the value fails to be copied to the clipboard
     */
    "copy-failed",
    ...Object.keys({ ...VTextField.emits }),
  ],
  setup(props, { emit }) {
    const value = computed(() => props.value);
    const { copy: doCopy, copied, isSupported, text } = useClipboard();
    const copy = async () => {
      await doCopy(value.value);
      if (copied.value && text.value === value.value) {
        emit("copied", copied.value);
        debug(`Copied: ${copied.value}`);
      } else {
        emit("copy-failed");
        debug(`Failed to copy: ${value.value}`);
      }
    };
    const defaults = useDefaults(props, "VTextField");
    const bound = computed(() => {
      const ret: any = {};
      for (const key in VTextField.props) {
        if (toSkip.includes(key)) {
          continue;
        }
        ret[key] = defaults[key as keyof typeof defaults];
      }
      return ret;
    });
    return {
      copy,
      isSupported,
      bound,
    };
  },
});
</script>

<style></style>
