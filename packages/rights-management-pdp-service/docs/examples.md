# Rights Management PDP Service Examples

These snippets show how to initialise a decision point and evaluate agreements with and without explicit action constraints.

## PolicyDecisionPointService

```typescript
import { PolicyDecisionPointService } from '@3sixty/rights-management-pdp-service';

const pdp = new PolicyDecisionPointService();

console.log(pdp.className()); // PolicyDecisionPointService
```

```typescript
import { PolicyDecisionPointService } from '@3sixty/rights-management-pdp-service';
import { PolicyType } from '@3sixty/standards-w3c-odrl';

const pdp = new PolicyDecisionPointService();

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

const decisions = await pdp.evaluate(agreement, { recordId: 'record-1' }, 'use');

console.log(decisions.length); // 1
```
