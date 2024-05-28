<template>
  <!-- @vue-expect-error v-card typedefs don't match what it actually accepts -->
  <v-card v-bind="formWrapperCardBindings" @submit.stop="submit">
    <input type="submit" style="display: none" />
    <!-- 
        @slot The header area of the form

        @binding {string} title The title of the form
    -->
    <slot name="header" v-bind="headerSlotBindings">
      <v-toolbar color="transparent" density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <!-- 
                @slot The buttons to put in the `v-toolbar-items` area of the default form header. Will not be rendered if a `header` slot is provided.

                @binding {string} title The title of the form
            -->
          <slot name="header-actions" v-bind="headerSlotBindings"></slot>
        </v-toolbar-items>
      </v-toolbar>
      <v-divider />
      <!-- @slot The area before the container of the fields -->
      <slot name="before-fields" />
      <v-container>
        <v-row>
          <v-col cols="12">
            <!-- 
                @slot The area before the username field

                @binding {string} baseColor
                @binding {string} bgColor
                @binding {string} variant
                @binding {boolean} scrollIntoView
                @binding {string} density
                @binding {boolean} disabled
                @binding {boolean} clearable
                @binding {boolean} flat
                @binding {boolean | string | number | undefined} rounded
                @binding {boolean} fieldSingleLine
                @binding {string | undefined} theme
                @binding {boolean} tile
                @binding {'text' | 'email'} type
                @binding {string} label
                @binding {string} autocomplete
                @binding {boolean} autofocus
                @binding {string | undefined} hint
                @binding {boolean} persistentHint
            -->
            <slot name="before-field-username" v-bind="form.username" />
            <v-text-field v-bind="form.username" />
            <!-- 
                @slot The area after the username field

                @binding {string} baseColor
                @binding {string} bgColor
                @binding {string} variant
                @binding {boolean} scrollIntoView
                @binding {string} density
                @binding {boolean} disabled
                @binding {boolean} clearable
                @binding {boolean} flat
                @binding {boolean | string | number | undefined} rounded
                @binding {boolean} fieldSingleLine
                @binding {string | undefined} theme
                @binding {boolean} tile
                @binding {'text' | 'email'} type
                @binding {string} label
                @binding {string} autocomplete
                @binding {boolean} autofocus
                @binding {string | undefined} hint
                @binding {boolean} persistentHint
            -->
            <slot name="after-field-username" v-bind="form.username" />
          </v-col>
        </v-row>
        <!-- @slot The area between the rows of the fields -->
        <slot name="between-fields" />
        <v-row>
          <v-col cols="12">
            <VPPasswordField v-bind="form.password" />
          </v-col>
        </v-row>
        <!-- @slot The area between the field rows and the action buttons -->
        <slot name="before-actions" />
      </v-container>
    </slot>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useForm } from "vee-validate";
import { vuetifyConfig } from "../../common/formUtils";
import VPPasswordField from "../fields/VPPasswordField.vue";
import type { PropType } from "vue";
import type {
  FieldValidationMetaInfo,
  FormFieldValidator,
} from "../../common/formUtils";
/**
 * The `vp-form-login` component renders a login form for use in a VuePrint application.
 *
 * @module @jakguru/vueprint-components/components/forms/VPFormLogin
 * @example
 * <template>
 *  <VPFormLogin
 *      title="Example Login Form"
 *      :onSubmit="() => alert('Form Submitted')"
 *      :usernameValidator="() => true"
 *      :passwordValidator="() => true"
 *  />
 *  <VPFormLogin
 *      title="Example of an Invalid Login Form"
 *      :onSubmit="() => alert('Form Submitted')"
 *      :usernameValidator="() => 'Please enter a valid username'"
 *      :passwordValidator="() => 'Please enter a valid password'"
 *  />
 * </template>
 */
export default defineComponent({
  name: "VPFormLogin",
  components: {
    VPPasswordField,
  },
  props: {
    /**
     * The function to call when the form is submitted after validation.
     */
    onSubmit: {
      type: Function as PropType<
        (
          action: string,
          method: string,
          data: Record<string, any>,
        ) => Promise<void> | void
      >,
      required: true,
    },
    /**
     * The URL to which the form will be submitted. Will be passed to the function defined in the `onSubmit` prop.
     */
    action: {
      type: String,
      default: "#",
    },
    /**
     * The HTTP method to use when submitting the form. Will be passed to the function defined in the `onSubmit` prop.
     */
    method: {
      type: String,
      default: "post",
    },
    /**
     * Designates the border-radius applied to the component. This can be xs, sm, md, lg, xl or a numeric value.
     */
    border: {
      type: [String, Number, Boolean],
      default: false,
    },
    /**
     * The background color of the form. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    bgColor: {
      type: String,
      default: "transparent",
    },
    /**
     * Designates an elevation applied to the form between 0 and 24. You can find more information in the [Vuetify elevation documentation](https://vuetifyjs.com/en/styles/elevation/).
     */
    elevation: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Removes the form's elevation.
     */
    flat: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the height for the form.
     */
    height: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Apply a specific background image to the form.
     */
    backgroundImage: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Sets the maximum height for the form.
     */
    maxHeight: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Sets the maximum width for the form.
     */
    maxWidth: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Sets the minimum height for the form.
     */
    minHeight: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Sets the minimum width for the form.
     */
    minWidth: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Sets the css positioning for the form.
     */
    position: {
      type: String as PropType<
        "static" | "relative" | "fixed" | "absolute" | "sticky" | undefined
      >,
      default: undefined,
    },
    /**
     * Applies the [v-ripple](https://vuetifyjs.com/en/directives/ripple/) directive.
     */
    ripple: {
      type: [Boolean, Object] as PropType<boolean | object | undefined>,
      default: false,
    },
    /**
     * Designates the border-radius applied to the form. This can be 0, xs, sm, true, lg, xl, pill, circle, and shaped. Find more information on available border radius classes in the [Vuetify Border Radius documentation](https://vuetifyjs.com/en/styles/border-radius/).
     */
    rounded: {
      type: [Boolean, Number, String] as PropType<
        boolean | number | string | undefined
      >,
      default: undefined,
    },
    /**
     * Specify a Vuetify theme for this form and all of its children.
     */
    theme: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes any applied border-radius from the form.
     */
    tile: {
      type: Boolean,
      default: false,
    },
    /**
     * Applies a distinct style to the form.
     * Options are `text`, `flat`, `elevated`, `tonal`, `outlined`, and `plain`.
     */
    variant: {
      type: String as PropType<
        "text" | "flat" | "elevated" | "tonal" | "outlined" | "plain"
      >,
      default: "elevated",
    },
    /**
     * Sets the width for the form.
     */
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    /**
     * Title to be displayed on the form
     */
    title: {
      type: String,
      default: "Authentication",
    },
    /**
     * The density of the form fields.
     */
    density: {
      type: String as PropType<"default" | "comfortable" | "compact">,
      default: "default",
    },
    /**
     * The variant of the form fields.
     */
    fieldVariant: {
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
     * Sets the color of the form fields when it not focused. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    fieldBaseColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Set the background color of the form fields. Can be the name of a theme color, a Vuetify Material Design color, or a CSS color value.
     */
    fieldBackgroundColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes elevation (shadow) added to element when using the `field-solo` or `field-solo-inverted` variants.
     */
    fieldFlat: {
      type: Boolean,
      default: false,
    },
    /**
     * Applies a border radius to the form fields
     */
    fieldRounded: {
      type: [Boolean, String, Number] as PropType<
        boolean | string | number | undefined
      >,
      default: undefined,
    },
    /**
     * Prevents labels from moving when fields are focused on or dirty
     */
    fieldSingleLine: {
      type: Boolean,
      default: false,
    },
    /**
     * Specify a theme for the form fields and all children.
     */
    fieldTheme: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Removes any applied border-radius from the form fields.
     */
    fieldTile: {
      type: Boolean,
      default: false,
    },
    /**
     * If the form fields should be clearable using a clear icon.
     */
    clearable: {
      type: Boolean,
      default: true,
    },
    /**
     * The validation function to use form the form's username field.
     */
    usernameValidator: {
      type: Function as PropType<FormFieldValidator>,
      required: true,
    },
    /**
     * The label to display for the username field.
     */
    usernameLabel: {
      type: String,
      default: "Username",
    },
    /**
     * The HTML5 input type to use for the username field.
     *
     * @values text, email
     */
    usernameType: {
      type: String as PropType<"text" | "email">,
      default: "text",
    },
    /**
     * The [HTML Autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls%3A-the-autocomplete-attribute) value to use for the username field.
     */
    usernameAutocomplete: {
      type: String,
      default: "username",
    },
    /**
     * Set the username field to autofocus on load.
     */
    usernameAutofocus: {
      type: Boolean,
      default: false,
    },
    /**
     * The icon to display for the username field.
     */
    usernameIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The position of the username icon.
     *
     * @values prepend, prepend-inner, append, append-inner
     */
    usernameIconPosition: {
      type: String as PropType<
        "prepend" | "prepend-inner" | "append" | "append-inner" | undefined
      >,
      default: undefined,
    },
    /**
     * Hint text to display when the username field is focused or `username-hint-persistent` is set.
     */
    usernameHint: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Persist the hint text when the username field is not focused.
     */
    usernameHintPersistent: {
      type: Boolean,
      default: false,
    },
    /**
     * The validation function to use form the form's password field.
     */
    passwordValidator: {
      type: Function as PropType<FormFieldValidator>,
      required: true,
    },
    /**
     * The label to display for the password field.
     */
    passwordLabel: {
      type: String,
      default: "Password",
    },
    /**
     * The [HTML Autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls%3A-the-autocomplete-attribute) value to use for the password field.
     */
    passwordAutocomplete: {
      type: String,
      default: "current-password",
    },
    /**
     * The icon to display for the password field.
     */
    passwordIcon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * The position of the password icon.
     *
     * @values prepend, prepend-inner, append
     */
    passwordIconPosition: {
      type: String as PropType<
        "prepend" | "prepend-inner" | "append" | undefined
      >,
      default: undefined,
    },
    /**
     * Hint text to display when the password field is focused or `password-hint-persistent` is set.
     */
    passwordHint: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    /**
     * Persist the hint text when the password field is not focused.
     */
    passwordHintPersistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    /**
     * Emitted when the form is submitted via the `onSubmit` function.
     *
     * @event submit
     * @property {any} result The result of the `onSubmit` function
     */
    "submit",
    /**
     * Emitted when the `onSubmit` function throws an error.
     *
     * @event submit:error
     * @property {Error} error The error that was thrown
     */
    "submit:error",
  ],
  setup(props, { emit }) {
    const action = computed(() => props.action);
    const method = computed(() => props.method);
    const border = computed(() => props.border);
    const bgColor = computed(() => props.bgColor);
    const elevation = computed(() => props.elevation);
    const flat = computed(() => props.flat);
    const height = computed(() => props.height);
    const backgroundImage = computed(() => props.backgroundImage);
    const maxHeight = computed(() => props.maxHeight);
    const maxWidth = computed(() => props.maxWidth);
    const minHeight = computed(() => props.minHeight);
    const minWidth = computed(() => props.minWidth);
    const position = computed(() => props.position);
    const ripple = computed(() => props.ripple);
    const rounded = computed(() => props.rounded);
    const theme = computed(() => props.theme);
    const tile = computed(() => props.tile);
    const variant = computed(() => props.variant);
    const width = computed(() => props.width);
    const formWrapperCardBindings = computed(() => ({
      tag: "form",
      action: action.value,
      method: method.value,
      border: border.value,
      color: bgColor.value,
      elevation: elevation.value,
      flat: flat.value,
      height: height.value,
      image: backgroundImage.value,
      maxHeight: maxHeight.value,
      maxWidth: maxWidth.value,
      minHeight: minHeight.value,
      minWidth: minWidth.value,
      position: position.value,
      ripple: ripple.value,
      rounded: rounded.value,
      theme: theme.value,
      tile: tile.value,
      variant: variant.value,
      width: width.value,
    }));
    const title = computed(() => props.title);
    const headerSlotBindings = computed(() => ({
      title: title.value,
    }));
    const usernameValidator = computed(() => props.usernameValidator);
    const passwordValidator = computed(() => props.passwordValidator);
    const {
      handleSubmit: handleFormSubmit,
      isSubmitting: formIsSubmitting,
      isValidating: formIsValidating,
      defineComponentBinds: defineFormComponentBinds,
      errors: formErrors,
      resetForm: resetFormFields,
      resetField: resetFormField,
      setFieldTouched: setFormFieldTouched,
      setTouched: setFormTouched,
    } = useForm({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: {
        username: (val: string, ctx: FieldValidationMetaInfo) =>
          usernameValidator.value(val, ctx),
        password: (val: string, ctx: FieldValidationMetaInfo) =>
          passwordValidator.value(val, ctx),
      },
    });
    const onSubmit = computed(() => props.onSubmit);
    const isSubmitting = ref(false);
    const submit = handleFormSubmit(async (values) => {
      isSubmitting.value = true;
      try {
        const result = await onSubmit.value(action.value, method.value, values);
        emit("submit", result);
      } catch (error) {
        emit("submit:error", error);
      }
      isSubmitting.value = false;
    });
    const density = computed(() => props.density);
    const fieldVariant = computed(() => props.fieldVariant);
    const fieldBaseColor = computed(() => props.fieldBaseColor);
    const fieldBackgroundColor = computed(() => props.fieldBackgroundColor);
    const fieldFlat = computed(() => props.fieldFlat);
    const fieldRounded = computed(() => props.fieldRounded);
    const fieldSingleLine = computed(() => props.fieldSingleLine);
    const fieldTheme = computed(() => props.fieldTheme);
    const fieldTile = computed(() => props.fieldTile);
    const clearable = computed(() => props.clearable);
    const usernameLabel = computed(() => props.usernameLabel);
    const usernameType = computed(() => props.usernameType);
    const usernameAutocomplete = computed(() => props.usernameAutocomplete);
    const usernameAutofocus = computed(() => props.usernameAutofocus);
    const usernameIcon = computed(() => props.usernameIcon);
    const usernameIconPosition = computed(() => props.usernameIconPosition);
    const usernameHint = computed(() => props.usernameHint);
    const usernameHintPersistent = computed(() => props.usernameHintPersistent);
    const passwordLabel = computed(() => props.passwordLabel);
    const passwordAutocomplete = computed(() => props.passwordAutocomplete);
    const passwordIcon = computed(() => props.passwordIcon);
    const passwordIconPosition = computed(() => props.passwordIconPosition);
    const passwordHint = computed(() => props.passwordHint);
    const passwordHintPersistent = computed(() => props.passwordHintPersistent);
    const fieldsAreDisabled = computed(() => formIsSubmitting.value);
    const fieldsAreaClearable = computed(
      () => !fieldsAreDisabled.value && clearable.value,
    );
    const usernameIconInfo = computed(() => {
      const ret: any = {};
      if (usernameIcon.value) {
        switch (usernameIconPosition.value) {
          case "prepend":
            ret.prependIcon = usernameIcon.value;
            break;
          case "prepend-inner":
            ret.prependInnerIcon = usernameIcon.value;
            break;
          case "append":
            ret.appendIcon = usernameIcon.value;
            break;
          case "append-inner":
            ret.appendInnerIcon = usernameIcon.value;
            break;
        }
      }
      return ret;
    });
    const passwordIconInfo = computed(() => {
      const ret: any = {};
      if (passwordIcon.value) {
        switch (passwordIconPosition.value) {
          case "prepend":
            ret.prependIcon = passwordIcon.value;
            break;
          case "prepend-inner":
            ret.prependInnerIcon = passwordIcon.value;
            break;
          case "append":
            ret.appendIcon = passwordIcon.value;
            break;
        }
      }
      return ret;
    });
    const fieldCommon = computed(() => ({
      baseColor: fieldBaseColor.value,
      bgColor: fieldBackgroundColor.value,
      variant: fieldVariant.value,
      scrollIntoView: true,
      density: density.value,
      disabled: fieldsAreDisabled.value,
      clearable: fieldsAreaClearable.value,
      flat: fieldFlat.value,
      rounded: fieldRounded.value,
      fieldSingleLine: fieldSingleLine.value,
      theme: fieldTheme.value,
      tile: fieldTile.value,
    }));
    const form = computed(() => ({
      username: {
        ...defineFormComponentBinds("username", vuetifyConfig).value,
        ...fieldCommon.value,
        type: usernameType.value,
        label: usernameLabel.value,
        autocomplete: usernameAutocomplete.value,
        autofocus: usernameAutofocus.value,
        ...usernameIconInfo.value,
        hint: usernameHint.value,
        persistentHint: usernameHintPersistent.value,
      },
      password: {
        ...defineFormComponentBinds("password", vuetifyConfig).value,
        ...fieldCommon.value,
        label: passwordLabel.value,
        autocomplete: passwordAutocomplete.value,
        ...passwordIconInfo.value,
        hint: passwordHint.value,
        persistentHint: passwordHintPersistent.value,
      },
    }));
    const formIsProcessing = computed(
      () => formIsSubmitting.value || isSubmitting.value,
    );
    return {
      formWrapperCardBindings,
      headerSlotBindings,
      form,
      formIsProcessing,
      formIsValidating,
      resetFormFields,
      resetFormField,
      formErrors,
      setFormFieldTouched,
      setFormTouched,
      submit,
    };
  },
});
</script>