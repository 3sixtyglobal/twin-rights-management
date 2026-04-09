# Rights Management Plugins Examples

These examples show how to wire default and pass-through plugins so negotiation, information retrieval, enforcement, and execution behaviours stay predictable.

## PassThroughPolicyRequester

```typescript
import { PassThroughPolicyRequester } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const requester = new PassThroughPolicyRequester();

const offerAccepted = await requester.offer('neg-1', {
  '@id': 'urn:rights-management:offer-1',
  '@type': PolicyType.Offer,
  assigner: 'did:example:provider'
});

const agreementAccepted = await requester.agreement('neg-1', {
  '@id': 'urn:rights-management:agreement-1',
  '@type': PolicyType.Agreement,
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer'
});

await requester.finalised('neg-1');
await requester.terminated('neg-1');

console.log(requester.className()); // PassThroughPolicyRequester
console.log(offerAccepted); // true
console.log(agreementAccepted); // true
```

## PassThroughPolicyNegotiator

```typescript
import { PassThroughPolicyNegotiator } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const negotiator = new PassThroughPolicyNegotiator();

const offer = {
  '@id': 'urn:rights-management:offer-1',
  '@type': PolicyType.Offer,
  assigner: 'did:example:provider'
};

const supported = negotiator.supportsOffer(offer);
const handled = await negotiator.handleOffer(offer, {
  'did:example:consumer': {
    '@id': 'did:example:consumer'
  }
});
const agreement = await negotiator.createAgreement(offer, 'did:example:consumer', {
  'did:example:consumer': {
    '@id': 'did:example:consumer'
  }
});

console.log(negotiator.className()); // PassThroughPolicyNegotiator
console.log(supported); // true
console.log(handled.accepted); // true
console.log(agreement?.['@type']); // Agreement
```

## LoggingPolicyExecutionAction

```typescript
import { LoggingPolicyExecutionAction } from '@twin.org/rights-management-plugins';
import { PolicyDecision, PolicyDecisionStage } from '@twin.org/rights-management-models';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const action = new LoggingPolicyExecutionAction({
  config: {
    stages: [PolicyDecisionStage.Before, PolicyDecisionStage.After],
    includeData: true,
    includePolicy: false,
    includeDecisions: true
  }
});

await action.execute(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': PolicyType.Agreement,
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer'
  },
  [{ target: '$.asset', decision: PolicyDecision.Granted }],
  { asset: 'dataset-1' },
  'use',
  PolicyDecisionStage.Before
);

console.log(action.className()); // LoggingPolicyExecutionAction
console.log(action.supportedStages()); // [ 'before', 'after' ]
```

## StaticPolicyInformationSource

```typescript
import { PolicyInformationAccessMode } from '@twin.org/rights-management-models';
import { StaticPolicyInformationSource } from '@twin.org/rights-management-plugins';

const source = new StaticPolicyInformationSource({
  config: {
    information: [
      {
        accessMode: PolicyInformationAccessMode.Any,
        objects: {
          'did:example:consumer': {
            '@id': 'did:example:consumer'
          }
        }
      }
    ]
  }
});

source.addInformation({
  accessMode: PolicyInformationAccessMode.Public,
  objects: {
    'urn:asset:dataset-1': {
      '@id': 'urn:asset:dataset-1'
    }
  },
  matchLocators: [
    {
      target: 'urn:asset:dataset-1'
    }
  ]
});

const result = await source.retrieve(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': 'Agreement',
    target: 'urn:asset:dataset-1'
  },
  PolicyInformationAccessMode.Public,
  { requestId: 'request-1' },
  'use'
);

console.log(source.className()); // StaticPolicyInformationSource
console.log(Object.keys(result ?? {}).length); // 2
```

## DefaultPolicyArbiter

```typescript
import { DefaultPolicyArbiter } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const arbiter = new DefaultPolicyArbiter();

const decisions = await arbiter.decide(
  {
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
  },
  {},
  { asset: 'dataset-1' },
  'use'
);

console.log(arbiter.className()); // DefaultPolicyArbiter
console.log(decisions[0].decision); // granted
```

```typescript
import { DefaultPolicyArbiter } from '@twin.org/rights-management-plugins';
import { OdrlPolicyType, OdrlProfiles } from '@twin.org/standards-w3c-odrl';

const arbiter = new DefaultPolicyArbiter();

// EcosystemPolicy with the TWIN profile — the arbiter evaluates its obligations directly.
const ecosystemDecisions = await arbiter.decide(
  {
    '@id': 'urn:rights-management:ecosystem-policy-1',
    '@type': OdrlPolicyType.EcosystemPolicy,
    profile: OdrlProfiles.Twin,
    assigner: 'did:example:publisher',
    obligation: [
      {
        action: 'inform',
        assignee: 'did:example:border-agency',
        target: 'urn:twin:asset:consignment:abc123'
      }
    ]
  },
  {},
  { consignment: 'abc123' },
  'inform'
);

console.log(ecosystemDecisions[0].decision); // granted
```

## PassThroughPolicyArbiter

```typescript
import { PassThroughPolicyArbiter } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const arbiter = new PassThroughPolicyArbiter();

const decisions = await arbiter.decide(
  {
    '@id': 'urn:rights-management:agreement-2',
    '@type': PolicyType.Agreement,
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer'
  },
  {},
  { asset: 'dataset-2' },
  'read'
);

console.log(arbiter.className()); // PassThroughPolicyArbiter
console.log(decisions[0].decision); // granted
```

## DefaultPolicyEnforcementProcessor

```typescript
import { PolicyDecision } from '@twin.org/rights-management-models';
import { DefaultPolicyEnforcementProcessor } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const processor = new DefaultPolicyEnforcementProcessor();

const processed = await processor.process(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': PolicyType.Agreement
  },
  [{ target: '$.asset', decision: PolicyDecision.Granted }],
  { asset: 'dataset-1', hidden: 'no' },
  'use'
);

console.log(processor.className()); // DefaultPolicyEnforcementProcessor
console.log(processed); // { asset: 'dataset-1' }
```

## PassThroughPolicyEnforcementProcessor

```typescript
import { PassThroughPolicyEnforcementProcessor } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const processor = new PassThroughPolicyEnforcementProcessor();

const result = await processor.process(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': PolicyType.Agreement
  },
  [],
  { asset: 'dataset-1' },
  'use'
);

console.log(processor.className()); // PassThroughPolicyEnforcementProcessor
console.log(result); // { asset: 'dataset-1' }
```

## IdentityPolicyInformationSource

```typescript
import { PolicyInformationAccessMode } from '@twin.org/rights-management-models';
import { IdentityPolicyInformationSource } from '@twin.org/rights-management-plugins';

const source = new IdentityPolicyInformationSource();

const info = await source.retrieve(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': 'Agreement',
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer'
  },
  PolicyInformationAccessMode.Any,
  { requestId: 'request-2' },
  'use'
);

console.log(source.className()); // IdentityPolicyInformationSource
console.log(Object.keys(info ?? {}).length); // 2
```

## PassThroughPolicyObligationEnforcer

```typescript
import { PassThroughPolicyObligationEnforcer } from '@twin.org/rights-management-plugins';
import { PolicyType } from '@twin.org/standards-w3c-odrl';

const enforcer = new PassThroughPolicyObligationEnforcer();

const enforced = await enforcer.enforce(
  {
    '@id': 'urn:rights-management:agreement-1',
    '@type': PolicyType.Agreement
  },
  {
    action: 'use'
  },
  {},
  { requestId: 'request-3' },
  'use'
);

console.log(enforcer.className()); // PassThroughPolicyObligationEnforcer
console.log(enforced); // true
```
