# Rights Management PXP Service Examples

Use these examples to execute policy actions in the before or after decision stage while keeping action metadata available to plugins.

## PolicyExecutionPointService

```typescript
import { PolicyDecision, PolicyDecisionStage } from '@twin.org/rights-management-models';
import { PolicyExecutionPointService } from '@twin.org/rights-management-pxp-service';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const pxp = new PolicyExecutionPointService();

await pxp.executeActions(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': PolicyType.Agreement,
    permission: [
      {
        target: 'urn:asset:dataset-1',
        action: 'use'
      }
    ]
  },
  [{ target: '$.asset', decision: PolicyDecision.Granted }],
  { asset: 'dataset-1' },
  'use',
  PolicyDecisionStage.Before
);

console.log(pxp.className()); // PolicyExecutionPointService
```
