# Interface: IPolicyNegotiationPointServiceConstructorOptions

Options for the Policy Negotiation Point Component.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component for logging policy negotiation.

***

### taskSchedulerComponentType? {#taskschedulercomponenttype}

> `optional` **taskSchedulerComponentType?**: `string`

The task scheduler component for scheduling background tasks.

#### Default

```ts
task-scheduler
```

***

### policyNegotiationAdministrationPointComponentType? {#policynegotiationadministrationpointcomponenttype}

> `optional` **policyNegotiationAdministrationPointComponentType?**: `string`

The type of the policy negotiation administration point component.

#### Default

```ts
policy-negotiation-admin-point
```

***

### policyNegotiationEntityStorageType? {#policynegotiationentitystoragetype}

> `optional` **policyNegotiationEntityStorageType?**: `string`

The entity storage the policy negotiation administration point stores negotiations in,
used by the expiry sweep.

#### Default

```ts
policy-negotiation
```

***

### policyAdministrationPointComponentType? {#policyadministrationpointcomponenttype}

> `optional` **policyAdministrationPointComponentType?**: `string`

The type of the policy administration point component.

#### Default

```ts
policy-administration-point
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

### trustComponentType? {#trustcomponenttype}

> `optional` **trustComponentType?**: `string`

The type of the trust component.

#### Default

```ts
trust
```

***

### policyNegotiationPointRemoteComponentType? {#policynegotiationpointremotecomponenttype}

> `optional` **policyNegotiationPointRemoteComponentType?**: `string`

The type of the negotiation component which can be constructed with a url.
To be used when sending request remotely to another node.

#### Default

```ts
policy-negotiation-point-remote
```

***

### platformComponentType? {#platformcomponenttype}

> `optional` **platformComponentType?**: `string`

Platform component type.

#### Default

```ts
platform
```

***

### config? {#config}

> `optional` **config?**: [`IPolicyNegotiationPointServiceConfig`](IPolicyNegotiationPointServiceConfig.md)

Configuration options for the policy negotiation point service.
