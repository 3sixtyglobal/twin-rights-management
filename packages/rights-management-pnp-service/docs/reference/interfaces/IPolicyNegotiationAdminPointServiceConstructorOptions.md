# Interface: IPolicyNegotiationAdminPointServiceConstructorOptions

Options for the Policy Negotiation Admin Point Component.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component for logging policy negotiation.

#### Default

```ts
logging
```

***

### taskSchedulerComponentType? {#taskschedulercomponenttype}

> `optional` **taskSchedulerComponentType?**: `string`

The task scheduler component for scheduling background tasks.

#### Default

```ts
task-scheduler
```

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

### partitionContextIds? {#partitioncontextids}

> `optional` **partitionContextIds?**: `string`[]

The keys to use from the context ids to cleanup partitions.

***

### policyNegotiationPointComponentType? {#policynegotiationpointcomponenttype}

> `optional` **policyNegotiationPointComponentType?**: `string`

If set, stall cleanup will use this component to send terminate to consumer callbacks.
If not set, stall cleanup will only mark negotiations as TERMINATED locally (no outbound notification).

#### Default

```ts
undefined
```

***

### config? {#config}

> `optional` **config?**: [`IPolicyNegotiationAdminPointServiceConfig`](IPolicyNegotiationAdminPointServiceConfig.md)

Configuration options for the policy negotiation point service.
