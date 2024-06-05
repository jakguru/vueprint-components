<template>
  <v-text-field v-bind="bound" ref="phoneNumberTextField" v-model="modelValue">
    <template #prepend-inner="scope">
      <!-- 
        @slot Slot that is prepended to the input.

        @binding {Ref<boolean>} isActive - Whether the input is currently active.
        @binding {Ref<boolean>} isFocused - Whether the input is currently focused.
        @binding {Ref<HTMLElement | undefined>} controlRef - Reference to the control element.
        @binding {() => void} focus - Function to focus the input.
        @binding {() => void} blur - Function to blur the input.
      -->
      <slot name="prepend-inner" v-bind="scope" />
      <v-menu v-bind="menuBindings">
        <template #activator="{ props }">
          <v-btn v-bind="{ ...props, ...menuButtonBindings }">
            <v-avatar v-if="currentCountryFlag">
              <v-img :src="currentCountryFlag" />
            </v-avatar>
            <v-icon v-else>{{ currentCountrySelectedFlagIcon }}</v-icon>
          </v-btn>
        </template>
        <v-card v-bind="menuCardBindings">
          <v-container>
            <v-text-field
              ref="countrySearchField"
              v-bind="countrySearchFieldBindings"
            />
          </v-container>
          <v-divider />
          <v-virtual-scroll
            v-bind="countryListItemsVSBindings"
            ref="countrySearchVirtualScroll"
          >
            <template #default="{ item, index }">
              <v-list-item v-bind="item">
                <template #append v-if="item.appendIcon">
                  <v-btn
                    icon
                    @click="item.onClickAppend"
                    variant="plain"
                    density="compact"
                  >
                    <v-icon>{{ item.appendIcon }}</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-divider v-if="index < countryListItemsLength - 1" />
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-menu>
    </template>
    <template v-for="(_, slot) of $slots" #[slot]="scope">
      <slot v-if="slot !== 'prepend-inner'" :name="slot" v-bind="scope" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, nextTick } from "vue";
import { VTextField } from "vuetify/components/VTextField";
import { useDefaults } from "vuetify";
import { countries } from "../../constants/countries";
import { square, rectangle } from "../../_assets/_flags";
import levenshtein from "fast-levenshtein";
import { defined } from "../../utilities/flow";
import { Phone } from "@jakguru/phone-object";
import { getDebugger } from "@jakguru/vueprint/utilities/debug";
import type { PropType, WritableComputedRef } from "vue";
import type { CountryItem } from "../../constants/countries";
import type { Country } from "@jakguru/phone-object";
import type { VVirtualScroll } from "vuetify/components/VVirtualScroll";

const debug = getDebugger("VPPhoneField");

type ValidationResult = string | boolean;
type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>);

const toSkip = [
  "prepend-inner-icon",
  "prependInnerIcon",
  "type",
  "onClick:prependInner",
  "modelValue",
  "onUpdate:modelValue",
  "error",
  "error-messages",
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
 * The `vp-phone-field` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:
 *
 * * A dropdown to allow the user to select the country of the phone number
 * * Additional handlers for built-in country field
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
 *                                    <VPPhoneField label="Phone Number" placeholder="Enter your Phone Number" v-model="phone" v-model:country="country" country-dropdown-clearable />
 *                                </v-col>
 *                            </v-row>
 *                            <v-row>
 *                                <v-col cols="12">
 *                                    <VPPhoneField label="Phone Number" variant="outlined" placeholder="Enter your Phone Number" v-model="phone" v-model:country="country" country-dropdown-clearable />
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
 *
 * <script setup>
 *  import { ref } from "vue";
 *  const phone = ref("");
 *  const country = ref("");
 * <\/script>
 */
export default defineComponent({
  name: "VPPhoneField",
  props: {
    /**
     * The phone number value. Accessible as a v-model using `v-model`
     */
    modelValue: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Automatically format the phone number when the field loses focus or typing stops for a short duration. The following options are available: `e164`, `international`, `national`, `raw`, or `false`. The default is `e164`.
     *
     * @values e164, international, national, raw, false
     */
    autoformat: {
      type: [String, Boolean] as PropType<
        "e164" | "international" | "national" | "raw" | false
      >,
      default: "e164",
    },
    /**
     * Puts the country input in a manual error state
     */
    countryError: {
      type: Boolean,
      default: false,
    },
    /**
     * Puts the country input in an error state and passes through custom error messages. Will be combined with any validations that occur from the country rules prop. This field will not trigger validation.
     */
    countryErrorMessages: {
      type: [String, Array] as PropType<undefined | string | string[]>,
      default: undefined,
    },
    /**
     * Displays a list of country input related messages or a single message if using a string.
     */
    countryMessages: {
      type: [String, Array] as PropType<undefined | string | string[]>,
      default: undefined,
    },
    /**
     * The ISO 3166-1 alpha-2 country code value for the country input. Accessible as a v-model using `v-model:country`
     */
    country: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The rules for validating the country field. Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string.
     */
    countryRules: {
      type: Array as PropType<ValidationRule[] | undefined>,
      default: undefined,
    },
    /**
     * The theme to apply to the country input and its children.
     */
    countryTheme: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The variant to use for the country input.
     */
    countryVariant: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    ...makeProps(),
    /**
     * Optional formatter to change the names of the countries displayed in the country dropdown list
     */
    countryNameFormatter: {
      type: Function as PropType<(country: CountryItem) => string | undefined>,
      default: undefined,
    },
    /**
     * Optional formatter to change the flags of the countries displayed in the country dropdown list and avatar
     */
    countryFlagFormatter: {
      type: Function as PropType<(country: CountryItem) => string | undefined>,
      default: undefined,
    },
    /**
     * The density of the country dropdown button
     */
    countryButtonDensity: {
      type: String as PropType<
        "default" | "comfortable" | "compact" | undefined
      >,
      default: "default",
    },
    /**
     * The elevation of the country dropdown button
     */
    countryButtonElevation: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined,
    },
    /**
     * Removes elevation from the country dropdown button
     */
    countryButtonFlat: {
      type: Boolean,
      default: false,
    },
    /**
     * The size of the country dropdown button. Default unit is px. Can also use the following predefined sizes: `x-small`, `small`, `default`, `large`, and `x-large`.
     */
    countryButtonSize: {
      type: [Number, String] as PropType<
        | number
        | string
        | "x-small"
        | "small"
        | "default"
        | "large"
        | "x-large"
        | undefined
      >,
      default: "small",
    },
    /**
     * Reduces the padding on the country dropdown button from `8px` to `0`
     */
    countryButtonSlim: {
      type: Boolean,
      default: true,
    },
    /**
     * Removes the country dropdown border radius from the country dropdown button
     */
    countryButtonTile: {
      type: Boolean,
      default: false,
    },
    /**
     * The variant to use for the country dropdown button
     */
    countryButtonVariant: {
      type: String as PropType<
        | "flat"
        | "text"
        | "elevated"
        | "tonal"
        | "outlined"
        | "plain"
        | undefined
      >,
      default: undefined,
    },
    /**
     * Defines the icon to be used when the country's flag cannot be found
     */
    defaultFlagIcon: {
      type: String,
      default: "mdi-earth",
    },
    /**
     * Defines the background color of the country dropdown button when a country is not selected. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    countryButtonBackgroundColor: {
      type: String,
      default: "surface",
    },
    /**
     * Defines the background color of the country dropdown list. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    countryDropdownBackgroundColor: {
      type: String,
      default: "surface",
    },
    /**
     * Defines the border radius to apply to the country dropdown list. Can be `xs`, `sm`, `md`, `lg`, `xl` or a number.
     */
    countryDropdownBorderRadius: {
      type: [String, Number] as PropType<
        string | "xs" | "sm" | "md" | "lg" | "xl" | number | undefined
      >,
      default: undefined,
    },
    /**
     * Defines the density of the country dropdown list
     */
    countryDropdownDensity: {
      type: String as PropType<
        "default" | "comfortable" | "compact" | undefined
      >,
      default: "default",
    },
    /**
     * Defines the elevation of the country dropdown list
     */
    countryDropdownElevation: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined,
    },
    /**
     * Removes elevation from the country dropdown list
     */
    countryDropdownFlat: {
      type: Boolean,
      default: false,
    },
    /**
     * Defines an image to display as the background of the country dropdown list
     */
    countryDropdownImage: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes the border radius from the dropdown list
     */
    countryDropdownTile: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the variant of the country dropdown list
     */
    countryDropdownVariant: {
      type: String as PropType<
        | "flat"
        | "text"
        | "elevated"
        | "tonal"
        | "outlined"
        | "plain"
        | undefined
      >,
      default: undefined,
    },
    /**
     * Sets the width of the country dropdown list
     */
    countryDropdownWidth: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Defines if a "clear" icon should be visible for the country dropdown list
     */
    countryDropdownClearable: {
      type: Boolean,
      default: false,
    },
    /**
     * Defines the default style of flag to be used for the country dropdown list
     */
    defaultFlagShape: {
      type: String as PropType<"square" | "rectangle">,
      default: "square",
    },
    /**
     * The optional function used to filter the countries shown in the dropdown
     * @param {string} search - The search string
     * @param {CountryItem} country - The country to filter
     * @returns {boolean} - Whether the country should be shown
     */
    countryFilter: {
      type: Function as PropType<
        (search: string | undefined, country: CountryItem) => boolean
      >,
      default: undefined,
    },
    /**
     * The label to display for the country search field.
     */
    countrySearchFieldLabel: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The variant of the country search field.
     */
    countrySearchFieldVariant: {
      type: String as PropType<
        | "underlined"
        | "outlined"
        | "filled"
        | "solo"
        | "solo-inverted"
        | "solo-filled"
        | "plain"
      >,
      default: "filled",
    },
    /**
     * Sets the color of the country search field when it not focused. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    countrySearchFieldBaseColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Set the background color of the country search field. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    countrySearchFieldBackgroundColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes elevation (shadow) added to element when using the `field-solo` or `field-solo-inverted` variants.
     */
    countrySearchFieldFlat: {
      type: Boolean,
      default: false,
    },
    /**
     * Applies a border radius to the country search field
     */
    countrySearchFieldRounded: {
      type: [Boolean, String, Number] as PropType<
        boolean | string | number | undefined
      >,
      default: undefined,
    },
    /**
     * Prevents labels from moving when fields are focused on or dirty
     */
    countrySearchFieldSingleLine: {
      type: Boolean,
      default: false,
    },
    /**
     * Specify a theme for the country search field and all children.
     */
    countrySearchFieldTheme: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes any applied border-radius from the country search field.
     */
    countrySearchFieldTile: {
      type: Boolean,
      default: false,
    },
    /**
     * If the country search field should be clearable using a clear icon.
     */
    countrySearchFieldClearable: {
      type: Boolean,
      default: true,
    },
    /**
     * Hint text to display when the country search field is focused or `country-search-field-hint-persistent` is set.
     */
    countrySearchFieldHint: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Persist the hint text when the country search field is not focused.
     */
    countrySearchFieldHintPersistent: {
      type: Boolean,
      default: false,
    },
    /**
     * Creates a [v-icon](https://vuetifyjs.com/en/api/v-icon/) in the space directly before the country search field.
     */
    countrySearchFieldPrependIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Creates a [v-icon](https://vuetifyjs.com/en/api/v-icon/) inside the country search field before the input area.
     */
    countrySearchFieldPrependInnerIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Creates a [v-icon](https://vuetifyjs.com/en/api/v-icon/) in the space directly after the country search field.
     */
    countrySearchFieldAppendIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Creates a [v-icon](https://vuetifyjs.com/en/api/v-icon/) inside the country search field after the input area.
     */
    countrySearchFieldAppendInnerIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  emits: [
    ...Object.keys({ ...VTextField.emits }),
    /**
     * Emitted when the phone value changes
     * @param {string} value - The new phone value
     */
    "update",
    /**
     * Emitted when the phone value changes
     * @param {string} value - The new phone value
     */
    "update:phone",
    /**
     * Emitted when the phone value changes
     * @param {string} value - The new phone value
     */
    "update:modelValue",
    /**
     * Emitted when the phone value changes
     * @param {string} value - The new phone value
     */
    "update:model-value",
    /**
     * Emitted when the country value changes
     * @param {string} value - The new country value
     */
    "update:country",
  ],
  setup(props, { emit }) {
    const countryDropdownOpen = ref(false);
    const preventNonTelInput = (e: KeyboardEvent) => {
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        !/^\d$/.test(e.key) &&
        ![
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "+",
          "-",
          "(",
          ")",
          " ",
          "Tab",
          "e",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
      if (e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        countryDropdownOpen.value = true;
      }
    };
    const phoneNumberTextField = ref<VTextField | undefined | null>(undefined);
    const focusOnPhoneNumberTextField = () => {
      defined<VTextField, undefined | null>(phoneNumberTextField).then(
        (ptf) => {
          if (ptf) {
            const input = ptf.$el.querySelector("input");
            if (input) {
              input.focus();
            }
          }
        },
      );
    };
    const defaults = useDefaults(props, "VPPhoneField");
    const lProps = useDefaults(defaults, "VTextField");
    const country: WritableComputedRef<string | undefined> = computed({
      get: () => props.country,
      set: (val) => {
        emit("update:country", val);
      },
    });
    const modelValue: WritableComputedRef<string | undefined> = computed({
      get: () => props.modelValue as string | undefined,
      set: (val) => {
        emit("update", val);
        emit("update:phone", val);
        emit("update:modelValue", val);
        emit("update:model-value", val);
      },
    });
    const autoformat = computed(() => lProps.autoformat);
    const doAutoFormat = () => {
      if (!modelValue.value) {
        debug("Model value is not set");
        return;
      }
      if (!autoformat.value) {
        debug('Autoformat is "false"');
        return;
      }
      if (!country.value || "XX" === country.value) {
        debug(`Country is not set or is "XX"`);
        return;
      }
      const phone = new Phone(modelValue.value, country.value as Country);
      if (!phone.valid) {
        debug(`Phone number is not valid`, {
          phone,
          value: modelValue.value,
          country: country.value,
        });
        return;
      }
      switch (autoformat.value) {
        case "e164":
          modelValue.value = phone.e164;
          break;
        case "international":
          modelValue.value = phone.international;
          break;
        case "national":
          modelValue.value = phone.national;
          break;
        case "raw":
          modelValue.value = phone.raw;
          break;
        default:
          break;
      }
      debug(`Autoformatted phone number`, {
        phone,
        autoformat: autoformat.value,
      });
    };
    let autoFormatAfterChangeTimeout: NodeJS.Timeout | undefined;
    watch(
      () => modelValue.value,
      () => {
        if (autoFormatAfterChangeTimeout) {
          clearTimeout(autoFormatAfterChangeTimeout);
        }
        autoFormatAfterChangeTimeout = setTimeout(() => {
          doAutoFormat();
        }, 500);
      },
    );
    watch(
      () => country.value,
      () => {
        doAutoFormat();
      },
    );
    const error = computed(() => lProps.error || lProps.countryError);
    const errorMessages = computed(() => [
      ...(lProps.errorMessages || []),
      ...(lProps.countryErrorMessages || []),
    ]);
    const bound = computed(() => {
      const ret: any = {
        type: "tel",
        onKeydown: preventNonTelInput,
        onKeyup: preventNonTelInput,
        onKeypress: preventNonTelInput,
        onBlur: doAutoFormat,
        error: error.value,
        errorMessages: errorMessages.value,
      };
      for (const key in VTextField.props) {
        if (toSkip.includes(key)) {
          continue;
        }
        ret[key] = defaults[key as keyof typeof defaults];
      }
      return ret;
    });
    const disabled = computed(() => lProps.disabled);
    const loading = computed(() => lProps.loading);
    const readonly = computed(() => lProps.readonly);
    const menuBindings = computed(() => ({
      closeOnBack: true,
      closeOnContentClick: false,
      modelValue: countryDropdownOpen.value,
      "onUpdate:modelValue": (val: boolean) => {
        if (!disabled.value && !loading.value && !readonly.value) {
          countryDropdownOpen.value = val;
        }
      },
      disabled: disabled.value,
      openOnClick: true,
      openOnFocus: false,
      openOnHover: false,
      persistent: false,
      scrim: false,
      offsetY: true,
    }));
    const countryButtonDensity = computed(() => lProps.countryButtonDensity);
    const countryButtonElevation = computed(
      () => lProps.countryButtonElevation,
    );
    const countryButtonFlat = computed(() => lProps.countryButtonFlat);
    const countryButtonSize = computed(() => lProps.countryButtonSize);
    const countryButtonSlim = computed(() => lProps.countryButtonSlim);
    const countryButtonTile = computed(() => lProps.countryButtonTile);
    const countryButtonVariant = computed(() => lProps.countryButtonVariant);
    const defaultFlagIcon = computed(() => lProps.defaultFlagIcon);
    const countryButtonBackgroundColor = computed(
      () => lProps.countryButtonBackgroundColor,
    );
    const countryValueLowerCased = computed(
      () => country.value?.toLowerCase() || "xx",
    );
    const validCountryValues = computed(() =>
      countries.map((c) => c.alpha2.toLowerCase()),
    );
    const selectedCountry = computed(() => {
      const country = countries.find(
        (c) => c.alpha2.toLowerCase() === countryValueLowerCased.value,
      );
      if (
        country &&
        validCountryValues.value.includes(country.alpha2.toLowerCase())
      ) {
        return country;
      } else {
        return {
          alpha2: "XX",
          name: "Unknown",
        };
      }
    });
    const getFlagIconForCountry = (
      country: CountryItem,
      shape: "square" | "rectangle" = "square",
    ) => {
      if (props.countryFlagFormatter) {
        return props.countryFlagFormatter(country);
      }
      switch (shape) {
        case "rectangle":
          return (
            rectangle[country.alpha2.toLowerCase() as keyof typeof rectangle] ||
            undefined
          );

        default:
          return (
            square[country.alpha2.toLowerCase() as keyof typeof square] ||
            undefined
          );
      }
    };
    const currentCountryFlag = computed(() =>
      getFlagIconForCountry(selectedCountry.value),
    );
    const menuButtonBindings = computed(() => ({
      icon: true,
      density: countryButtonDensity.value,
      disabled: disabled.value,
      elevation: countryButtonElevation.value,
      flat: countryButtonFlat.value,
      loading: loading.value,
      rounded: "circle",
      size: countryButtonSize.value,
      slim: countryButtonSlim.value,
      tile: countryButtonTile.value,
      variant: countryButtonVariant.value,
      color: countryButtonBackgroundColor.value,
      active: countryDropdownOpen.value,
    }));
    const countryDropdownBackgroundColor = computed(
      () => lProps.countryDropdownBackgroundColor,
    );
    const countryDropdownBorderRadius = computed(
      () => lProps.countryDropdownBorderRadius,
    );
    const countryDropdownDensity = computed(
      () => lProps.countryDropdownDensity,
    );
    const countryDropdownElevation = computed(
      () => lProps.countryDropdownElevation,
    );
    const countryDropdownFlat = computed(() => lProps.countryDropdownFlat);
    const countryDropdownImage = computed(() => lProps.countryDropdownImage);
    const countryDropdownTile = computed(() => lProps.countryDropdownTile);
    const countryDropdownVariant = computed(
      () => lProps.countryDropdownVariant,
    );
    const countryDropdownWidth = computed(() => lProps.countryDropdownWidth);
    const menuCardBindings = computed(() => ({
      border: countryDropdownBorderRadius.value,
      color: countryDropdownBackgroundColor.value,
      countryDropdownDensity: countryDropdownDensity.value,
      minHeight: "48px",
      elevation: countryDropdownElevation.value,
      flat: countryDropdownFlat.value,
      image: countryDropdownImage.value,
      tile: countryDropdownTile.value,
      variant: countryDropdownVariant.value,
      width: countryDropdownWidth.value,
      minWidth: 270,
    }));
    watch(
      () => disabled.value,
      (is) => {
        if (is) {
          countryDropdownOpen.value = false;
        }
      },
    );
    watch(
      () => loading.value,
      (is) => {
        if (is) {
          countryDropdownOpen.value = false;
        }
      },
    );
    watch(
      () => readonly.value,
      (is) => {
        if (is) {
          countryDropdownOpen.value = false;
        }
      },
    );
    const countryFilter = computed(() => lProps.countryFilter);
    const countryNameFormatter = computed(() => lProps.countryNameFormatter);
    const countryDropdownClearable = computed(
      () => lProps.countryDropdownClearable,
    );
    const defaultFlagShape = computed(() => lProps.defaultFlagShape);
    const countryListItems = computed(() =>
      [...countries]
        .map((c) => ({
          name: countryNameFormatter.value
            ? countryNameFormatter.value(c)
            : c.name,
          alpha2: c.alpha2,
        }))
        .filter((c) => {
          if (countryFilter.value) {
            return countryFilter.value(countrySearch.value, c);
          }
          if (!countrySearch.value) {
            return true;
          }
          return (
            c.name.toLowerCase().includes(countrySearch.value.toLowerCase()) ||
            c.alpha2.toLowerCase().includes(countrySearch.value.toLowerCase())
          );
        })
        .map((c) => ({
          ...c,
          score: countrySearch.value
            ? Math.min(
                levenshtein.get(
                  c.name.toLowerCase(),
                  countrySearch.value.toLowerCase(),
                ),
                levenshtein.get(
                  c.alpha2.toLowerCase(),
                  countrySearch.value.toLowerCase(),
                ),
              )
            : 0,
        }))
        .sort((a, b) => {
          if (a.alpha2.toLowerCase() === countryValueLowerCased.value) {
            return -1;
          }
          if (b.alpha2.toLowerCase() === countryValueLowerCased.value) {
            return 1;
          }
          if (countrySearch.value) {
            if (
              a.alpha2.toLowerCase() === countrySearch.value.toLowerCase() ||
              a.name.toLowerCase() === countrySearch.value.toLowerCase()
            ) {
              return -1;
            }
            if (
              b.alpha2.toLowerCase() === countrySearch.value.toLowerCase() ||
              b.name.toLowerCase() === countrySearch.value.toLowerCase()
            ) {
              return 1;
            }
            return a.score - b.score;
          }
          return a.name.localeCompare(b.name);
        })
        .map((c) => ({
          active: c.alpha2 === country.value,
          appendIcon:
            c.alpha2 === country.value && countryDropdownClearable.value
              ? "mdi-close-circle"
              : undefined,
          prependAvatar: getFlagIconForCountry(c, defaultFlagShape.value),
          disabled: disabled.value || loading.value || readonly.value,
          title: c.name,
          value: c.alpha2,
          onClick: () => {
            country.value = c.alpha2;
            countrySearch.value = undefined;
            nextTick(() => {
              countryDropdownOpen.value = false;
              focusOnPhoneNumberTextField();
            });
          },
          onClickAppend: (e: MouseEvent) => {
            if (countryDropdownClearable.value) {
              e.stopPropagation();
              e.preventDefault();
              country.value = undefined;
            }
          },
        })),
    );
    const countrySearch = ref<string | undefined>(undefined);
    const countrySearchVirtualScroll = ref<VVirtualScroll | undefined | null>(
      undefined,
    );
    let onCountrySearchKeydownAbortController: AbortController | undefined;
    const onCountrySearchKeydown = (e: KeyboardEvent) => {
      if (onCountrySearchKeydownAbortController) {
        onCountrySearchKeydownAbortController.abort();
      }
      onCountrySearchKeydownAbortController = new AbortController();
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (countryListItems.value.length >= 1) {
          countryListItems.value[0].onClick();
        }
      }
      if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        defined<VVirtualScroll, undefined | null>(
          countrySearchVirtualScroll,
          onCountrySearchKeydownAbortController.signal,
          [undefined, null],
        ).then((vs) => {
          if (!vs) {
            debug("Failed to find country search virtual scroll", { vs });
            return;
          }
          vs.scrollToIndex(0);
          setTimeout(() => {
            const firstCountryListItem = vs.$el.querySelector(
              ".v-list-item",
            ) as HTMLElement | null;
            if (firstCountryListItem) {
              firstCountryListItem.focus();
            } else {
              debug("Failed to find first country list item", {
                firstCountryListItem,
              });
            }
          }, 100);
        });
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        countryDropdownOpen.value = false;
        focusOnPhoneNumberTextField();
      }
    };
    const onCountrySearchKeyInteraction = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const countrySearchFieldLabel = computed(
      () => lProps.countrySearchFieldLabel,
    );
    const countrySearchFieldVariant = computed(
      () => lProps.countrySearchFieldVariant,
    );
    const countrySearchFieldBaseColor = computed(
      () => lProps.countrySearchFieldBaseColor,
    );
    const countrySearchFieldBackgroundColor = computed(
      () => lProps.countrySearchFieldBackgroundColor,
    );
    const countrySearchFieldFlat = computed(
      () => lProps.countrySearchFieldFlat,
    );
    const countrySearchFieldRounded = computed(
      () => lProps.countrySearchFieldRounded,
    );
    const countrySearchFieldSingleLine = computed(
      () => lProps.countrySearchFieldSingleLine,
    );
    const countrySearchFieldTheme = computed(
      () => lProps.countrySearchFieldTheme,
    );
    const countrySearchFieldTile = computed(
      () => lProps.countrySearchFieldTile,
    );
    const countrySearchFieldClearable = computed(
      () => lProps.countrySearchFieldClearable,
    );
    const countrySearchFieldHint = computed(
      () => lProps.countrySearchFieldHint,
    );
    const countrySearchFieldHintPersistent = computed(
      () => lProps.countrySearchFieldHintPersistent,
    );
    const countrySearchFieldPrependIcon = computed(
      () => lProps.countrySearchFieldPrependIcon,
    );
    const countrySearchFieldPrependInnerIcon = computed(
      () => lProps.countrySearchFieldPrependInnerIcon,
    );
    const countrySearchFieldAppendIcon = computed(
      () => lProps.countrySearchFieldAppendIcon,
    );
    const countrySearchFieldAppendInnerIcon = computed(
      () => lProps.countrySearchFieldAppendInnerIcon,
    );
    const countrySearchFieldBindings = computed(() => ({
      type: "search",
      modelValue: countrySearch.value,
      "onUpdate:modelValue": (val: string) => {
        countrySearch.value = val;
      },
      onKeydown: onCountrySearchKeydown,
      onKeyup: onCountrySearchKeyInteraction,
      onKeypress: onCountrySearchKeyInteraction,
      label: countrySearchFieldLabel.value,
      variant: countrySearchFieldVariant.value,
      baseColor: countrySearchFieldBaseColor.value,
      bgColor: countrySearchFieldBackgroundColor.value,
      flat: countrySearchFieldFlat.value,
      rounded: countrySearchFieldRounded.value,
      singleLine: countrySearchFieldSingleLine.value,
      theme: countrySearchFieldTheme.value,
      tile: countrySearchFieldTile.value,
      clearable: countrySearchFieldClearable.value,
      hint: countrySearchFieldHint.value,
      hintPersistent: countrySearchFieldHintPersistent.value,
      prependIcon: countrySearchFieldPrependIcon.value,
      prependInnerIcon: countrySearchFieldPrependInnerIcon.value,
      appendIcon: countrySearchFieldAppendIcon.value,
      appendInnerIcon: countrySearchFieldAppendInnerIcon.value,
      disabled: disabled.value || loading.value || readonly.value,
      hideDetails: countrySearchFieldHintPersistent.value
        ? false
        : "string" === typeof countrySearchFieldHint.value
          ? "auto"
          : true,
    }));
    const countryListItemsLength = computed(
      () => countryListItems.value.length,
    );
    const countryListItemsVSBindings = computed(() => ({
      items: countryListItems.value,
      itemHeight: 48,
      maxHeight: 240,
    }));
    const countrySearchField = ref<VTextField | undefined | null>(undefined);
    let countrySearchFieldCheckTimeout: NodeJS.Timeout | undefined;
    const autoFocusOnCountrySearchField = async () => {
      if (countrySearchFieldCheckTimeout) {
        clearTimeout(countrySearchFieldCheckTimeout);
      }
      const autoFocusOnCountrySearchFieldAbortController =
        new AbortController();
      countrySearchFieldCheckTimeout = setTimeout(() => {
        autoFocusOnCountrySearchFieldAbortController.abort();
      }, 1000);
      const returned = await defined<VTextField, undefined | null>(
        countrySearchField,
        autoFocusOnCountrySearchFieldAbortController.signal,
        [undefined, null],
      );
      if (returned) {
        const input = returned.$el.querySelector("input");
        if (input) {
          input.focus();
          debug("Auto-focused on country search field", { returned, input });
        } else {
          debug("Failed to auto-focus on country search field", { returned });
        }
      } else {
        debug("Failed to auto-focus on country search field", { returned });
      }
    };
    watch(
      () => countryDropdownOpen.value,
      (isOpen) => {
        if (isOpen) {
          autoFocusOnCountrySearchField();
        } else if (countrySearchFieldCheckTimeout) {
          clearTimeout(countrySearchFieldCheckTimeout);
        }
      },
    );
    return {
      bound,
      countryDropdownOpen,
      menuBindings,
      menuButtonBindings,
      currentCountryFlag,
      currentCountrySelectedFlagIcon: defaultFlagIcon.value,
      menuCardBindings,
      countrySearchField,
      countrySearchFieldBindings,
      countryListItemsLength,
      countryListItemsVSBindings,
      countrySearchVirtualScroll,
      phoneNumberTextField,
      modelValue,
    };
  },
});
</script>
