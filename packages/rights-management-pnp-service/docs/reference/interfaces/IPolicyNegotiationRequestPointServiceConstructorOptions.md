# Interface: IPolicyNegotiationRequestPointServiceConstructorOptions

Options for the Policy Negotiation Request Point Component.

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

### policyInformationPointComponentType?

> `optional` **policyInformationPointComponentType**: `string`

The type of the policy information point component.

#### Default

```ts
policy-information-point
```

***

### config

> **config**: [`IPolicyNegotiationRequestPointServiceConfig`](IPolicyNegotiationRequestPointServiceConfig.md)

Configuration options for the policy negotiation request point service.
