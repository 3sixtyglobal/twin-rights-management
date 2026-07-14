# Interface: IPassThroughPolicyNegotiatorConstructorOptions

Options for the Pass Through Policy Negotiator.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component for policy negotiator.

***

### directAgreement? {#directagreement}

> `optional` **directAgreement?**: `boolean`

Signal directAgreement (skip OFFERED/ACCEPTED) on handleOffer(); default true. Set false to keep the full negotiation cycle, e.g. during a staged rollout where counterparties may not yet accept a direct REQUESTED -> AGREED transition.
