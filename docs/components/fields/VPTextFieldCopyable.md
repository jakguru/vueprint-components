# VPTextFieldCopyable

The `vp-text-field-copyable` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:

* A copy button that copies the value of the text field to the clipboard

::: info Important Note
This component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.
:::

## Example Usage

<v-container fluid class="demo-container">
 <VPTextFieldCopyable value="Example Value" label="Example Copyable Text Field" @copied="$toast.fire({ icon: 'success', title: 'Copied' })" @copy-failed="$toast.fire({ icon: 'error', title: 'Failed to Copy' })" />
</v-container>

## Reference

### Properties

### Events

### Slots

### Methods

```json
{
  "displayName": "VPTextFieldCopyable",
  "description": "The `vp-text-field-copyable` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:\n\n* A copy button that copies the value of the text field to the clipboard\n\n::: info Important Note\nThis component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.\n:::",
  "tags": {
    "module": [
      {
        "description": "@jakguru/vueprint-components/components/fields/VPPasswordField",
        "title": "module"
      }
    ],
    "examples": [
      {
        "title": "example",
        "content": "<template>\n <VPTextFieldCopyable value=\"Example Value\" label=\"Example Copyable Text Field\" @copied=\"$toast.fire({ icon: 'success', title: 'Copied' })\" @copy-failed=\"$toast.fire({ icon: 'error', title: 'Failed to Copy' })\" />\n</template>"
      }
    ]
  },
  "exportName": "default",
  "events": [
    {
      "name": "copied"
    },
    {
      "name": "copy-failed"
    }
  ],
  "slots": [
    {
      "name": "slot",
      "scoped": true,
      "bindings": [
        {
          "name": "name",
          "title": "binding"
        }
      ]
    }
  ],
  "sourceFiles": [
    "/Users/jak/Development/vueprint-components/src/components/fields/VPTextFieldCopyable.vue"
  ]
}
```

```json
{
  "displayName": "VPTextFieldCopyable",
  "displayNameKebab": "vp-text-field-copyable",
  "description": "The `vp-text-field-copyable` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:\n\n* A copy button that copies the value of the text field to the clipboard\n\n::: info Important Note\nThis component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.\n:::",
  "module": "@jakguru/vueprint-components/components/fields/VPPasswordField",
  "example": "<v-container fluid class=\"demo-container\">\n <VPTextFieldCopyable value=\"Example Value\" label=\"Example Copyable Text Field\" @copied=\"$toast.fire({ icon: 'success', title: 'Copied' })\" @copy-failed=\"$toast.fire({ icon: 'error', title: 'Failed to Copy' })\" />\n</v-container>"
}
```
