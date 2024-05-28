export interface FieldValidationMetaInfo {
  field: string;
  name: string;
  label?: string;
  value: unknown;
  form: Record<string, unknown>;
  rule?: {
    name: string;
    params?: Record<string, unknown> | unknown[];
  };
}

export interface FormFieldValidator<T = unknown> {
  (value: T, meta: FieldValidationMetaInfo): true | string;
}

export const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.touched ? state.errors : [],
    "hide-details":
      !state.touched ||
      state.errors.filter(
        (v: unknown) => typeof v === "string" && v.trim().length > 0,
      ).length === 0
        ? false
        : "auto",
  },
});
