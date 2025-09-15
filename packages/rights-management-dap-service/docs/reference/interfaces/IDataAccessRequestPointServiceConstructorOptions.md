# Interface: IDataAccessRequestPointServiceConstructorOptions

Options for the Data Access Request Point Component.

## Properties

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

The logging component for logging policy negotiation.

#### Default

```ts
logging
```

***

### identityConnectorType?

> `optional` **identityConnectorType**: `string`

The identity connector component for managing identities.

#### Default

```ts
identity
```

***

### config

> **config**: [`IDataAccessRequestPointServiceConfig`](IDataAccessRequestPointServiceConfig.md)

Configuration options for the data access request point service.
