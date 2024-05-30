<template>
  <v-text-field
    ref="field"
    v-bind="updatedProps"
    class="vp-password-field"
    v-on="updatedEmitters"
  >
    <template #append-inner>
      <v-btn
        v-if="showGenerator"
        icon
        @click="onGeneratePassword"
        variant="plain"
        density="compact"
      >
        <v-icon>mdi-form-textbox-password</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="togglePasswordFieldType"
        variant="plain"
        density="compact"
      >
        <v-icon>{{ passwordFieldTypeIcon }}</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<style lang="scss">
.vp-password-field {
  input:focus,
  input:active {
    opacity: 1;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { VTextField } from "vuetify/components/VTextField";
import { useDefaults } from "vuetify";
import generator from "generate-password-ts";
/**
 * The `vp-password-field` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:
 *
 * * Password visibility toggle
 * * Password generation button + event
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
 *   <v-app>
 *     <v-main>
 *         <v-container class="fill-height" fluid>
 *             <v-row justify="center">
 *                 <v-col cols="12">
 *                     <v-card>
 *                         <v-container>
 *                             <v-row>
 *                                 <v-col cols="12">
 *                                     <VPPasswordField v-model="password" label="Password" />
 *                                 </v-col>
 *                             </v-row>
 *                             <v-row>
 *                                 <v-col cols="12">
 *                                     <VPPasswordField v-model="password" label="Password with Generator Button" show-generator />
 *                                 </v-col>
 *                             </v-row>
 *                         </v-container>
 *                     </v-card>
 *                 </v-col>
 *             </v-row>
 *         </v-container>
 *     </v-main>
 *   </v-app>
 * </template>
 *
 * <script setup>
 *  import { ref } from "vue";
 *  const password = ref("");
 * <\/script>
 */
export default defineComponent({
  name: "VPPasswordField",
  props: {
    ...VTextField.props,
    /**
     * Whether to show the password generator button
     */
    showGenerator: {
      type: Boolean,
      default: false,
    },
    /**
     * The length of the password to generate
     */
    generatePasswordLength: {
      type: Number,
      default: 12,
    },
    /**
     * Whether to include numbers in the generated password
     */
    generatePasswordWithNumbers: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to include symbols in the generated password
     */
    generatePasswordWithSymbols: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to include uppercase characters in the generated password
     */
    generatePasswordWithUppercase: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to exclude similar characters in the generated password
     */
    generatePasswordExcludingSimilarCharacters: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    ...Object.keys({ ...VTextField.emits }),
    /**
     * Emitted when the password generator button is clicked
     */
    "generate-password",
  ],
  setup(props, { emit }) {
    const passwordFieldType = ref("password");
    const generatePasswordLength = computed(() => props.generatePasswordLength);
    const generatePasswordWithNumbers = computed(
      () => props.generatePasswordWithNumbers,
    );
    const generatePasswordWithSymbols = computed(
      () => props.generatePasswordWithSymbols,
    );
    const generatePasswordWithUppercase = computed(
      () => props.generatePasswordWithUppercase,
    );
    const generatePasswordExcludingSimilarCharacters = computed(
      () => props.generatePasswordExcludingSimilarCharacters,
    );
    const passwordFieldTypeIcon = computed(() =>
      passwordFieldType.value === "password"
        ? "mdi-eye-lock-open-outline"
        : "mdi-eye-off-outline",
    );
    const togglePasswordFieldType = () => {
      passwordFieldType.value =
        passwordFieldType.value === "password" ? "text" : "password";
    };
    const onGeneratePassword = () => {
      const password = generator.generate({
        length: generatePasswordLength.value,
        numbers: generatePasswordWithNumbers.value,
        symbols: generatePasswordWithSymbols.value,
        uppercase: generatePasswordWithUppercase.value,
        excludeSimilarCharacters:
          generatePasswordExcludingSimilarCharacters.value,
      });
      passwordFieldType.value = "text";
      emit("generate-password", password);
      emit("update:modelValue", password);
    };
    const passedProps = computed(() => props);
    const defaults = useDefaults(passedProps.value, "VTextField");
    const updatedProps = computed(() => ({
      ...defaults,
      type: passwordFieldType.value,
      "append-inner-icon": undefined,
    }));
    const updatedEmitters = computed(() => {
      const ret: any = {};
      Object.keys({ ...VTextField.emits }).forEach((evnt) => {
        ret[evnt] = (e: any) => emit(evnt, e);
      });
      return ret;
    });
    const field = ref<VTextField | undefined>(undefined);
    return {
      updatedProps,
      updatedEmitters,
      field,
      onGeneratePassword,
      passwordFieldTypeIcon,
      togglePasswordFieldType,
    };
  },
});
</script>
