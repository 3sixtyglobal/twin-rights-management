# Interface: ILoggingPolicyExecutionActionConfig

Options for the Logging Policy Execution Action Component.

## Properties

### stages? {#stages}

> `optional` **stages?**: `PolicyDecisionStage`[]

The policy decision stages to log, if undefined defaults to all.

***

### includeData? {#includedata}

> `optional` **includeData?**: `boolean`

Whether to include the data in the log.

#### Default

```ts
false
```

***

### includePolicy? {#includepolicy}

> `optional` **includePolicy?**: `boolean`

Whether to include the policy in the log.

#### Default

```ts
false
```

***

### includeDecisions? {#includedecisions}

> `optional` **includeDecisions?**: `boolean`

Whether to include the decisions in the log.

#### Default

```ts
false
```
