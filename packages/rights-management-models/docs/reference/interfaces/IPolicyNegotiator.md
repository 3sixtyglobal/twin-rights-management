# Interface: IPolicyNegotiator

Interface describing a Policy Negotiator.

## Methods

### supportedPolicies()

> **supportedPolicies**(): [`IPolicyLocator`](IPolicyLocator.md)[]

The policies supported by this negotiator.

#### Returns

[`IPolicyLocator`](IPolicyLocator.md)[]

The supported policies, if empty can be used for all.

***

### negotiate()

> **negotiate**(`policyId`, `locator`, `information?`): `Promise`\<\{ `state`: [`IPolicyState`](IPolicyState.md); `policy?`: `IOdrlPolicy`; \}\>

Determines if a policy can be created for the requested resource.

#### Parameters

##### policyId

`string`

The policy id to use if creating a new policy.

##### locator

[`IPolicyLocator`](IPolicyLocator.md)

The locator to find relevant policies.

##### information?

[`IPolicyInformation`](IPolicyInformation.md)

Information provided by the requester to determine if a policy can be created.

#### Returns

`Promise`\<\{ `state`: [`IPolicyState`](IPolicyState.md); `policy?`: `IOdrlPolicy`; \}\>

The state of the policy and the actual policy if it was approved.
