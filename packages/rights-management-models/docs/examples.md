# Rights Management Models Examples

Use these snippets to inspect ODRL policies, extract common identifiers, and match policies against request criteria before handing them to services.

## OdrlPolicyHelper

```typescript
import { OdrlPolicyHelper } from '@3sixty/rights-management-models';

const policy = {
  '@id': 'urn:rm:policy:policy-1',
  '@type': 'Agreement',
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  target: 'urn:asset:dataset-1',
  action: 'use'
};

const policyId = OdrlPolicyHelper.getUid(policy);
const policyType = OdrlPolicyHelper.getType(policy);

console.log(policyId); // urn:rm:policy:policy-1
console.log(policyType); // Agreement
```

```typescript
import { OdrlPolicyHelper } from '@3sixty/rights-management-models';

const policy = {
  '@id': 'urn:rm:policy:policy-2',
  '@type': 'Agreement',
  assigner: [{ '@id': 'did:example:provider' }],
  assignee: ['did:example:consumer-1', { '@id': 'did:example:consumer-2' }]
};

const assigner = OdrlPolicyHelper.extractAssignerIdentity(policy);
const assignee = OdrlPolicyHelper.extractAssigneeIdentity(policy);

console.log(assigner); // did:example:provider
console.log(assignee); // [ 'did:example:consumer-1', 'did:example:consumer-2' ]
```

```typescript
import { OdrlPolicyHelper } from '@3sixty/rights-management-models';

const parties = [
  'did:example:consumer-1',
  { '@id': 'did:example:consumer-2' },
  [{ '@id': 'did:example:consumer-3' }]
];

const partyIds = OdrlPolicyHelper.getPartyIds(parties);

console.log(partyIds); // [ 'did:example:consumer-1', 'did:example:consumer-2', 'did:example:consumer-3' ]
```

```typescript
import { OdrlPolicyHelper } from '@3sixty/rights-management-models';

const policy = {
  '@id': 'urn:rm:policy:policy-3',
  '@type': 'Agreement',
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  target: [{ '@id': 'urn:asset:dataset-1' }, 'urn:asset:dataset-2'],
  action: [{ '@id': 'read' }, 'use']
};

const targets = OdrlPolicyHelper.getTargets(policy);
const actions = OdrlPolicyHelper.getActions(policy);
const matches = OdrlPolicyHelper.matchPolicy(policy, {
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  target: 'urn:asset:dataset-2',
  action: 'use'
});

console.log(targets); // [ 'urn:asset:dataset-1', 'urn:asset:dataset-2' ]
console.log(actions); // [ 'read', 'use' ]
console.log(matches); // true
```
