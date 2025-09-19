# Interface: IPolicyNegotiationPointServiceConstructorOptions

Options for the Policy Negotiation Point Component.

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

### policyNegotiationAdministrationPointComponentType?

> `optional` **policyNegotiationAdministrationPointComponentType**: `string`

The type of the policy negotiation administration point component.

#### Default

```ts
policy-negotiation-admin-point
```

***

### policyAdministrationPointComponentType?

> `optional` **policyAdministrationPointComponentType**: `string`

The type of the policy administration point component.

#### Default

```ts
policy-administration-point
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

> **config**: [`IPolicyNegotiationPointServiceConfig`](IPolicyNegotiationPointServiceConfig.md)

Configuration options for the policy negotiation point service.
