# Interface: IDataAccessPointServiceConfig

Options for the Data Access Point Component.

## Properties

### proofTtlInSeconds?

> `optional` **proofTtlInSeconds**: `number`

The time-to-live (TTL) for proof in seconds.

#### Default

```ts
300 (5 minutes)
```

***

### handlers?

> `optional` **handlers**: `object`[]

Initial handler to register with the DAP.

#### handlerId

> **handlerId**: `string`

#### handler

> **handler**: `IDataAccessHandler`
