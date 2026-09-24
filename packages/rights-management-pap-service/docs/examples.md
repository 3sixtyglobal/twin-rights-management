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

console.log(entity.id); // urn:rights-management:policy-1
console.log(entity.type); // Agreement
```

## OdrlPolicyIndex

The administration point resolves the locator filters on `query` against a separate index table. It
stores one row per combination of assigner, assignee, target and action that a policy carries, all
on a single composite index, so a locator naming several of those fields is answered by one lookup
rather than one lookup per field. Values are always stored lower cased, and locator values are
lower cased before lookup, so matching is case insensitive.

The composite index is built on the `assignerHash`, `assigneeHash`, `targetHash` and `actionHash`
columns, which hold the base64 url encoded Blake2b-160 hash of each lower cased value, rather than
on the values themselves. This keeps the index key a fixed size whatever the length of the values,
so it stays within the key size limit of databases such as MySQL. The values are kept alongside
their hashes.

`OdrlPolicyIndexHelper.createIndexEntry` builds the entry for one combination, case folding and
hashing the values and deriving the `id` from the content, so the same combination always produces
the same entry. `OdrlPolicyIndexHelper.hashValue` gives the hash to look a value up by.

```typescript
import { OdrlPolicyIndexHelper } from '@twin.org/rights-management-pap-service';

const entity = OdrlPolicyIndexHelper.createIndexEntry(
  'urn:rights-management:policy-1',
  '2026-01-01T00:00:00.000Z',
  'did:example:Provider',
  'did:example:consumer',
  'urn:asset:dataset-1',
  'use'
);

console.log(entity.assigner); // did:example:provider
console.log(entity.assignerHash === OdrlPolicyIndexHelper.hashValue('DID:EXAMPLE:PROVIDER')); // true
```

A policy with a single assigner, assignee, target and action produces one row. A policy with two
targets and two actions produces four, one for each combination, which is what keeps the lookup to
a single query. The creation date is copied onto each row so the index can order and page its own
matches, which is why ordering a locator query by `dateCreated` applies across the whole result
rather than only within a page.

The rows are read with `queryJoin`, which joins the policies onto the index, groups the rows by
`policyId` so a policy matched by several of them is returned once, and requires the join so the
policies excluded by the query conditions do not take up room on a page.
