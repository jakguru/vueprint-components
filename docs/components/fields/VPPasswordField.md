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

<PropsTable encoded="W3sibmFtZSI6InNob3dHZW5lcmF0b3IiLCJkZXNjcmlwdGlvbiI6IldoZXRoZXIgdG8gc2hvdyB0aGUgcGFzc3dvcmQgZ2VuZXJhdG9yIGJ1dHRvbiIsInR5cGUiOnsibmFtZSI6ImJvb2xlYW4ifSwiZGVmYXVsdFZhbHVlIjp7ImZ1bmMiOmZhbHNlLCJ2YWx1ZSI6ImZhbHNlIn19LHsibmFtZSI6ImdlbmVyYXRlUGFzc3dvcmRMZW5ndGgiLCJkZXNjcmlwdGlvbiI6IlRoZSBsZW5ndGggb2YgdGhlIHBhc3N3b3JkIHRvIGdlbmVyYXRlIiwidHlwZSI6eyJuYW1lIjoibnVtYmVyIn0sImRlZmF1bHRWYWx1ZSI6eyJmdW5jIjpmYWxzZSwidmFsdWUiOiIxMiJ9fSx7Im5hbWUiOiJnZW5lcmF0ZVBhc3N3b3JkV2l0aE51bWJlcnMiLCJkZXNjcmlwdGlvbiI6IldoZXRoZXIgdG8gaW5jbHVkZSBudW1iZXJzIGluIHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQiLCJ0eXBlIjp7Im5hbWUiOiJib29sZWFuIn0sImRlZmF1bHRWYWx1ZSI6eyJmdW5jIjpmYWxzZSwidmFsdWUiOiJ0cnVlIn19LHsibmFtZSI6ImdlbmVyYXRlUGFzc3dvcmRXaXRoU3ltYm9scyIsImRlc2NyaXB0aW9uIjoiV2hldGhlciB0byBpbmNsdWRlIHN5bWJvbHMgaW4gdGhlIGdlbmVyYXRlZCBwYXNzd29yZCIsInR5cGUiOnsibmFtZSI6ImJvb2xlYW4ifSwiZGVmYXVsdFZhbHVlIjp7ImZ1bmMiOmZhbHNlLCJ2YWx1ZSI6InRydWUifX0seyJuYW1lIjoiZ2VuZXJhdGVQYXNzd29yZFdpdGhVcHBlcmNhc2UiLCJkZXNjcmlwdGlvbiI6IldoZXRoZXIgdG8gaW5jbHVkZSB1cHBlcmNhc2UgY2hhcmFjdGVycyBpbiB0aGUgZ2VuZXJhdGVkIHBhc3N3b3JkIiwidHlwZSI6eyJuYW1lIjoiYm9vbGVhbiJ9LCJkZWZhdWx0VmFsdWUiOnsiZnVuYyI6ZmFsc2UsInZhbHVlIjoidHJ1ZSJ9fSx7Im5hbWUiOiJnZW5lcmF0ZVBhc3N3b3JkRXhjbHVkaW5nU2ltaWxhckNoYXJhY3RlcnMiLCJkZXNjcmlwdGlvbiI6IldoZXRoZXIgdG8gZXhjbHVkZSBzaW1pbGFyIGNoYXJhY3RlcnMgaW4gdGhlIGdlbmVyYXRlZCBwYXNzd29yZCIsInR5cGUiOnsibmFtZSI6ImJvb2xlYW4ifSwiZGVmYXVsdFZhbHVlIjp7ImZ1bmMiOmZhbHNlLCJ2YWx1ZSI6InRydWUifX1d" />

### Events

<EventsTable encoded="W3sibmFtZSI6ImdlbmVyYXRlLXBhc3N3b3JkIiwiZGVzY3JpcHRpb24iOiJFbWl0dGVkIHdoZW4gdGhlIHBhc3N3b3JkIGdlbmVyYXRvciBidXR0b24gaXMgY2xpY2tlZCJ9XQ==" />

### Slots

<SlotsTable encoded="W10=" />

### Methods

<MethodsTable encoded="W10=" />
