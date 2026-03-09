# Rights Management PEP Service Examples

Use these examples to enforce agreements directly, by agreement id, or through a locator query when policy selection is delegated.

## PolicyEnforcementPointService

```typescript
import { PolicyEnforcementPointService } from '@twin.org/rights-management-pep-service';

const pep = new PolicyEnforcementPointService();

console.log(pep.className()); // PolicyEnforcementPointService
```

```typescript
import { PolicyEnforcementPointService } from '@twin.org/rights-management-pep-service';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const pep = new PolicyEnforcementPointService();

const agreement = {
  '@context': 'http://www.w3.org/ns/odrl.jsonld',
  '@id': 'urn:rights-management:agreement-1',
  '@type': PolicyType.Agreement,
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  permission: [
    {
      target: 'urn:asset:dataset-1',
      action: 'use'
    }
  ]
};

const filtered = await pep.interceptWithPolicy(agreement, { asset: 'dataset-1' }, 'use');

console.log(filtered); // { asset: 'dataset-1' }
```

```typescript
import { PolicyEnforcementPointService } from '@twin.org/rights-management-pep-service';

const pep = new PolicyEnforcementPointService();

const byId = await pep.interceptWithId(
  'urn:rights-management:agreement-1',
  { field: 'value' },
  'use'
);
const byLocator = await pep.interceptWithLocator(
  {
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer',
    target: 'urn:asset:dataset-1',
    action: 'use'
  },
  { field: 'value' },
  'use'
);

console.log(byId); // { field: 'value' }
console.log(byLocator); // { field: 'value' }
```
