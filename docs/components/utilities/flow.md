# @jakguru/vueprint-components/components/utilities/flow

```typescript
import { defined } from '@jakguru/vueprint-components/components/utilities/flow';
```

## Functions

### `defined`

<div class="mb-2"></div>



#### Signatures

Asyncronously wait until a value is defined before resolving the promise

```typescript
defined(what: undefined | T, signal?: AbortSignal): Promise<undefined | T>
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `what` | undefined | T | The value to check for when it is defined |
| `signal` | AbortSignal | An abort controller signal which can be used to prematurely end the promise |
