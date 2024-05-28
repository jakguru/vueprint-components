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

<PropsTable encoded="W10=" />

### Events

<EventsTable encoded="W3sibmFtZSI6ImNvcGllZCIsImRlc2NyaXB0aW9uIjoiRW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBpcyBzdWNjZXNzZnVsbHkgY29waWVkIHRvIHRoZSBjbGlwYm9hcmQiLCJwcm9wZXJ0aWVzIjpbeyJ0eXBlIjp7Im5hbWVzIjpbInN0cmluZyJdfSwibmFtZSI6InZhbHVlIiwiZGVzY3JpcHRpb24iOiJUaGUgdmFsdWUgdGhhdCB3YXMgY29waWVkIn1dfSx7Im5hbWUiOiJjb3B5LWZhaWxlZCIsImRlc2NyaXB0aW9uIjoiRW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBmYWlscyB0byBiZSBjb3BpZWQgdG8gdGhlIGNsaXBib2FyZCJ9XQ==" />

### Slots

<SlotsTable encoded="W3sibmFtZSI6InNsb3QiLCJzY29wZWQiOnRydWUsImJpbmRpbmdzIjpbeyJuYW1lIjoibmFtZSIsInRpdGxlIjoiYmluZGluZyJ9XX1d" />

### Methods

<MethodsTable encoded="W10=" />
