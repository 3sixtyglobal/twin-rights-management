# Rights Management PAP Service Examples

These examples show how to register policies, retrieve specific policy shapes, and query stored policies for downstream policy components.

## PolicyAdministrationPointService

```typescript
import { PolicyAdministrationPointService } from '@twin.org/rights-management-pap-service';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const pap = new PolicyAdministrationPointService();

const policyId = await pap.create({
  '@context': 'http://www.w3.org/ns/odrl.jsonld',
  '@type': PolicyType.Agreement,
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  permission: [
    {
      target: 'urn:asset:dataset-1',
      action: 'use'
    }
  ]
});

console.log(policyId); // urn:rights-management:...
console.log(pap.className()); // PolicyAdministrationPointService
```

```typescript
import { PolicyAdministrationPointService } from '@twin.org/rights-management-pap-service';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const pap = new PolicyAdministrationPointService();

await pap.update({
  '@context': 'http://www.w3.org/ns/odrl.jsonld',
  '@id': 'urn:rights-management:policy-1',
  '@type': PolicyType.Offer,
  assigner: 'did:example:provider',
  permission: [
    {
      target: 'urn:asset:dataset-1',
      action: 'read'
    }
  ]
});

const policy = await pap.get('urn:rights-management:policy-1');
const offer = await pap.getOffer('urn:rights-management:policy-1');

console.log(policy['@id']); // urn:rights-management:policy-1
console.log(offer['@type']); // Offer
```

```typescript
import { PolicyAdministrationPointService } from '@twin.org/rights-management-pap-service';

const pap = new PolicyAdministrationPointService();

const agreement = await pap.getAgreement('urn:rights-management:agreement-1');
const set = await pap.getSet('urn:rights-management:set-1');

console.log(agreement['@type']); // Agreement
console.log(set['@type']); // Set
```

```typescript
import { PolicyAdministrationPointService } from '@twin.org/rights-management-pap-service';

const pap = new PolicyAdministrationPointService();

const queryResult = await pap.query(
  {
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer',
    target: 'urn:asset:dataset-1',
    action: 'use'
  },
  {
    conditions: [],
    logicalOperator: 'and'
  },
  'cursor-1',
  25
);

await pap.remove('urn:rights-management:policy-1');

console.log(queryResult.policies.length); // 0
console.log(queryResult.cursor); // cursor-2
```

## OdrlPolicy

```typescript
import { OdrlPolicy } from '@twin.org/rights-management-pap-service';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const entity = new OdrlPolicy();
entity.id = 'urn:rights-management:policy-1';
entity.type = PolicyType.Agreement;
entity.assigner = 'did:example:provider';
entity.assignee = 'did:example:consumer';
entity.target = 'urn:asset:dataset-1';
entity.action = 'use';
entity.assignerIndex = '|did:example:provider|';
entity.assigneeIndex = '|did:example:consumer|';
entity.targetIndex = '|urn:asset:dataset-1|';
entity.actionIndex = '|use|';

console.log(entity.id); // urn:rights-management:policy-1
console.log(entity.type); // Agreement
```
