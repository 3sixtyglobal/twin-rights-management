# Rights Management PMP Service Examples

These snippets focus on policy retrieval workflows where callers filter by identity, target, or action before a decision is made.

## PolicyManagementPointService

```typescript
import { PolicyManagementPointService } from '@3sixty/rights-management-pmp-service';

const pmp = new PolicyManagementPointService();

console.log(pmp.className()); // PolicyManagementPointService
```

```typescript
import { PolicyManagementPointService } from '@3sixty/rights-management-pmp-service';

const pmp = new PolicyManagementPointService();

const result = await pmp.retrieve(
  {
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer',
    target: 'urn:asset:dataset-1',
    action: 'use'
  },
  'cursor-1'
);

console.log(result.policies.length); // 1
console.log(result.cursor); // cursor-2
```
