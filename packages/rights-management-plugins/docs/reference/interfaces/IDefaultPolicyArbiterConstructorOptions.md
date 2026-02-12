# Interface: IDefaultPolicyArbiterConstructorOptions

Options for the Default Policy Arbiter.

## Properties

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

The logging component for policy arbiter.

#### Default

```ts
logging
```

***

### policyAdministrationPointComponentType?

> `optional` **policyAdministrationPointComponentType**: `string`

The policy administration point component for retrieving inherited policies.

#### Default

```ts
policy-administration-point
```

***

### config?

> `optional` **config**: [`IDefaultPolicyArbiterConfig`](IDefaultPolicyArbiterConfig.md)

The configuration options for the default policy arbiter.
