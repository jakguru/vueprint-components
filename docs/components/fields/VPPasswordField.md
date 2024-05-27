# VPPasswordField

The `vp-password-field` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:

* Password visibility toggle
* Password generation button + event

::: info Important Note
This component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.
:::

## Example Usage

<v-container fluid class="demo-container">
 <VPPasswordField v-model="password" label="Password" />
 <VPPasswordField v-model="password" label="Password with Generator Button" show-generator />
</v-container>

<script setup>
 import { ref } from "vue";
 const password = ref("");
</script>

## Reference

### Properties

### Events

### Slots

### Methods

```json
{
  "displayName": "VPPasswordField",
  "description": "The `vp-password-field` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:\n\n* Password visibility toggle\n* Password generation button + event\n\n::: info Important Note\nThis component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.\n:::",
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
        "content": "<template>\n <VPPasswordField v-model=\"password\" label=\"Password\" />\n <VPPasswordField v-model=\"password\" label=\"Password with Generator Button\" show-generator />\n</template>\n\n<script setup>\n import { ref } from \"vue\";\n const password = ref(\"\");\n<\\/script>"
      }
    ]
  },
  "exportName": "default",
  "props": [
    {
      "name": "showGenerator",
      "description": "Whether to show the password generator button",
      "type": {
        "name": "boolean"
      },
      "defaultValue": {
        "func": false,
        "value": "false"
      }
    },
    {
      "name": "generatePasswordLength",
      "description": "The length of the password to generate",
      "type": {
        "name": "number"
      },
      "defaultValue": {
        "func": false,
        "value": "12"
      }
    },
    {
      "name": "generatePasswordWithNumbers",
      "description": "Whether to include numbers in the generated password",
      "type": {
        "name": "boolean"
      },
      "defaultValue": {
        "func": false,
        "value": "true"
      }
    },
    {
      "name": "generatePasswordWithSymbols",
      "description": "Whether to include symbols in the generated password",
      "type": {
        "name": "boolean"
      },
      "defaultValue": {
        "func": false,
        "value": "true"
      }
    },
    {
      "name": "generatePasswordWithUppercase",
      "description": "Whether to include uppercase characters in the generated password",
      "type": {
        "name": "boolean"
      },
      "defaultValue": {
        "func": false,
        "value": "true"
      }
    },
    {
      "name": "generatePasswordExcludingSimilarCharacters",
      "description": "Whether to exclude similar characters in the generated password",
      "type": {
        "name": "boolean"
      },
      "defaultValue": {
        "func": false,
        "value": "true"
      }
    }
  ],
  "events": [
    {
      "name": "generate-password",
      "description": "Emitted when the password generator button is clicked"
    }
  ],
  "sourceFiles": [
    "/Users/jak/Development/vueprint-components/src/components/fields/VPPasswordField.vue"
  ]
}
```

```json
{
  "displayName": "VPPasswordField",
  "displayNameKebab": "vp-password-field",
  "description": "The `vp-password-field` component extends the [v-text-field](https://vuetifyjs.com/en/api/v-text-field/) Vuetify component with additional functionality:\n\n* Password visibility toggle\n* Password generation button + event\n\n::: info Important Note\nThis component is a wrapper around the `v-text-field` component. It is recommended to refer to the [Vuetify documentation](https://vuetifyjs.com/en/api/v-text-field/) for more information on the available props and events.\n:::",
  "module": "@jakguru/vueprint-components/components/fields/VPPasswordField",
  "example": "<v-container fluid class=\"demo-container\">\n <VPPasswordField v-model=\"password\" label=\"Password\" />\n <VPPasswordField v-model=\"password\" label=\"Password with Generator Button\" show-generator />\n</v-container>\n\n<script setup>\n import { ref } from \"vue\";\n const password = ref(\"\");\n</script>"
}
```
