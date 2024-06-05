# @jakguru/vueprint-components/utilities/flow

```typescript
import { arrayOfDefined, defined } from '@jakguru/vueprint-components/utilities/flow';
```

## Functions

### `arrayOfDefined`

<div class="mb-2"></div>



#### Signatures

Asyncronously wait until an array of values are defined before resolving the promise

```typescript
arrayOfDefined<T = any, B = undefined>(what: T[] | Ref<T[]>, signal?: AbortSignal, bad: any[]): Promise<(T | B)[]>
```

#### Type Variables

| Name | Type | Default | Description |
| ---- | ---------- | ------- | ------- |
| `T` |  | `any` | The type of the value to check for when it is defined |
| `B` |  | `undefined` | The type of the value to return if the value is not defined |
#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `what` | `T[] \| Ref<T[]>` | The array of values to check to ensure they are defined |
| `signal` | `AbortSignal` | An abort controller signal which can be used to prematurely end the promise |
| `bad` | `any[]` | An array of values to consider as "bad" or "undefined" |
### `defined`

<div class="mb-2"></div>



#### Signatures

Asyncronously wait until a value is defined before resolving the promise

```typescript
defined<T = any, B = undefined>(what: T | B | Ref<T | B>, signal?: AbortSignal, bad: any[]): Promise<T | B>
```

#### Type Variables

| Name | Type | Default | Description |
| ---- | ---------- | ------- | ------- |
| `T` |  | `any` | The type of the value to check for when it is defined |
| `B` |  | `undefined` | The type of the value to return if the value is not defined |
#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `what` | `T \| B \| Ref<T \| B>` | The value to check for when it is defined |
| `signal` | `AbortSignal` | An abort controller signal which can be used to prematurely end the promise |
| `bad` | `any[]` | An array of values to consider as "bad" or "undefined" |
