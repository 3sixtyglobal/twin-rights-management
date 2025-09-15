# Interface: IDataAccessPointServiceConstructorOptions

Options for the Data Access Point Service.

## Properties

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

The logging component for logging data access operations.

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

### policyEnforcementPointComponentType?

> `optional` **policyEnforcementPointComponentType**: `string`

The type of the policy enforcement point component.

#### Default

```ts
policy-enforcement-point
```

***

### config?

> `optional` **config**: [`IDataAccessPointServiceConfig`](IDataAccessPointServiceConfig.md)

Configuration options for the data access point service.
