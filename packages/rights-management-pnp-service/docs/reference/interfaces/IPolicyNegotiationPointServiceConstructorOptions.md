# Interface: IPolicyNegotiationPointServiceConstructorOptions

Options for the Policy Negotiation Point Component.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType**: `string`

The logging component for logging policy negotiation.

***

### policyNegotiationAdministrationPointComponentType? {#policynegotiationadministrationpointcomponenttype}

> `optional` **policyNegotiationAdministrationPointComponentType**: `string`

The type of the policy negotiation administration point component.

***

### policyAdministrationPointComponentType? {#policyadministrationpointcomponenttype}

> `optional` **policyAdministrationPointComponentType**: `string`

The type of the policy administration point component.

***

### policyInformationPointComponentType? {#policyinformationpointcomponenttype}

> `optional` **policyInformationPointComponentType**: `string`

The type of the policy information point component.

***

### trustComponentType? {#trustcomponenttype}

> `optional` **trustComponentType**: `string`

The type of the trust component.

***

### policyNegotiationPointRemoteComponentType? {#policynegotiationpointremotecomponenttype}

> `optional` **policyNegotiationPointRemoteComponentType**: `string`

The type of the negotiation component which can be constructed with a url.
To be used when sending request remotely to another node.

***

### config {#config}

> **config**: [`IPolicyNegotiationPointServiceConfig`](IPolicyNegotiationPointServiceConfig.md)

Configuration options for the policy negotiation point service.
