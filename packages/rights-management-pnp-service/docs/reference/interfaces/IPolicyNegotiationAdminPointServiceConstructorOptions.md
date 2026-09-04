# Interface: IPolicyNegotiationAdminPointServiceConstructorOptions

Options for the Policy Negotiation Admin Point Component.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component for logging policy negotiation.

***

### policyNegotiationEntityStorageType? {#policynegotiationentitystoragetype}

> `optional` **policyNegotiationEntityStorageType?**: `string`

The entity storage component for storing policy negotiation.

#### Default

```ts
policy-negotiation
```

***

### policyInformationPointComponentType? {#policyinformationpointcomponenttype}

> `optional` **policyInformationPointComponentType?**: `string`

The type of the policy information point component.

#### Default

```ts
policy-information-point
```

***

### config? {#config}

> `optional` **config?**: [`IPolicyNegotiationAdminPointServiceConfig`](IPolicyNegotiationAdminPointServiceConfig.md)

Configuration options for the policy negotiation point service.
