# Rights Management PIP Service Examples

The following snippets show how to retrieve contextual information for decisions in both policy-specific and generic retrieval flows.

## PolicyInformationPointService

```typescript
import { PolicyInformationPointService } from '@twin.org/rights-management-pip-service';

const pip = new PolicyInformationPointService();

console.log(pip.className()); // PolicyInformationPointService
```

```typescript
import { PolicyInformationAccessMode } from '@twin.org/rights-management-models';
import { PolicyInformationPointService } from '@twin.org/rights-management-pip-service';

const pip = new PolicyInformationPointService();

const information = await pip.retrieve(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': 'Agreement',
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer'
  },
  PolicyInformationAccessMode.Any,
  {
    requestId: 'request-1'
  },
  'use'
);

console.log(Object.keys(information).length); // 1
```
