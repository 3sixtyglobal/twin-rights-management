# Rights Management REST Client Examples

These examples show how to call remote rights-management endpoints for policy administration and contract negotiation workflows.

## PolicyNegotiationPointRestClient

```typescript
import { PolicyNegotiationPointRestClient } from '@3sixty/rights-management-rest-client';
import {
  DataspaceProtocolContexts,
  DataspaceProtocolContractNegotiationTypes
} from '@3sixty/standards-dataspace-protocol';

const pnpClient = new PolicyNegotiationPointRestClient({
  endpoint: 'https://api.example.com'
});

const trustPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

const negotiation = await pnpClient.getNegotiation(
  'urn:rights-management:provider-neg-1',
  trustPayload
);

const requestResult = await pnpClient.requestFromConsumer(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
    consumerPid: 'urn:rights-management:consumer-neg-1',
    offer: {
      '@id': 'urn:rights-management:offer-1',
      '@type': 'Offer',
      assigner: 'did:example:provider'
    },
    callbackAddress: 'https://consumer.example.com/callbacks/pnp'
  },
  trustPayload
);

console.log(pnpClient.className()); // PolicyNegotiationPointRestClient
console.log(negotiation['@type']); // ContractNegotiation
console.log(requestResult['@type']); // ContractNegotiation
```

```typescript
import { PolicyNegotiationPointRestClient } from '@3sixty/rights-management-rest-client';
import {
  DataspaceProtocolContexts,
  DataspaceProtocolContractNegotiationEventType,
  DataspaceProtocolContractNegotiationTypes
} from '@3sixty/standards-dataspace-protocol';

const pnpClient = new PolicyNegotiationPointRestClient({
  endpoint: 'https://api.example.com'
});

const trustPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

const offerResult = await pnpClient.offerFromProvider(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1',
    offer: {
      '@id': 'urn:rights-management:offer-1',
      '@type': 'Offer'
    }
  },
  trustPayload
);

const agreementError = await pnpClient.agreementFromProvider(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1',
    callbackAddress: 'https://provider.example.com/callbacks/pnp',
    agreement: {
      '@id': 'urn:rights-management:agreement-1',
      '@type': 'Agreement',
      assigner: 'did:example:provider',
      assignee: 'did:example:consumer'
    }
  },
  trustPayload
);

const verificationError = await pnpClient.agreementVerificationFromConsumer(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractAgreementVerificationMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1'
  },
  trustPayload
);

const eventError = await pnpClient.event(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1',
    event: DataspaceProtocolContractNegotiationEventType.ACCEPTED
  },
  'provider',
  trustPayload
);

const terminateError = await pnpClient.terminate(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractNegotiationTerminationMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1'
  },
  'consumer',
  trustPayload
);

console.log(offerResult['@type']); // ContractNegotiation
console.log(agreementError); // undefined
console.log(verificationError); // undefined
console.log(eventError); // undefined
console.log(terminateError); // undefined
```

```typescript
import { PolicyNegotiationPointRestClient } from '@3sixty/rights-management-rest-client';

const pnpClient = new PolicyNegotiationPointRestClient({
  endpoint: 'https://api.example.com'
});

try {
  await pnpClient.sendRequestToProvider(
    'https://provider.example.com/pnp',
    'policy-requester',
    'urn:rights-management:offer-1'
  );
} catch (error) {
  console.log((error as Error).name); // NotSupportedError
}

try {
  await pnpClient.sendTerminateToConsumer(
    'https://consumer.example.com/callbacks/pnp',
    'urn:rights-management:provider-neg-1',
    'urn:rights-management:consumer-neg-1'
  );
} catch (error) {
  console.log((error as Error).name); // NotSupportedError
}
```

## PolicyAdministrationPointRestClient

```typescript
import { PolicyAdministrationPointRestClient } from '@3sixty/rights-management-rest-client';
import { PolicyType } from '@3sixty/standards-w3c-odrl';

const papClient = new PolicyAdministrationPointRestClient({
  endpoint: 'https://api.example.com'
});

const createdPolicyId = await papClient.create({
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

await papClient.update({
  '@context': 'http://www.w3.org/ns/odrl.jsonld',
  '@id': createdPolicyId,
  '@type': PolicyType.Agreement,
  assigner: 'did:example:provider',
  assignee: 'did:example:consumer',
  permission: [
    {
      target: 'urn:asset:dataset-1',
      action: 'read'
    }
  ]
});

const policy = await papClient.get(createdPolicyId);
const agreement = await papClient.getAgreement(createdPolicyId);
const offer = await papClient.getOffer('urn:rights-management:offer-1');
const set = await papClient.getSet('urn:rights-management:set-1');
const queryResult = await papClient.query(
  {
    assigner: 'did:example:provider',
    assignee: 'did:example:consumer',
    target: 'urn:asset:dataset-1',
    action: 'read'
  },
  undefined,
  'cursor-1',
  25
);

await papClient.remove(createdPolicyId);

console.log(papClient.className()); // PolicyAdministrationPointRestClient
console.log(policy['@id']); // urn:rights-management:...
console.log(agreement['@type']); // Agreement
console.log(offer['@type']); // Offer
console.log(set['@type']); // Set
console.log(queryResult.policies.length); // 1
```

## PolicyNegotiationAdminPointRestClient

```typescript
import { PolicyNegotiationAdminPointRestClient } from '@3sixty/rights-management-rest-client';
import { DataspaceProtocolContractNegotiationStateType } from '@3sixty/standards-dataspace-protocol';

const adminClient = new PolicyNegotiationAdminPointRestClient({
  endpoint: 'https://api.example.com'
});

await adminClient.set({
  id: 'urn:rights-management:provider-neg-1',
  correlationId: 'urn:rights-management:consumer-neg-1',
  dateCreated: new Date().toISOString(),
  state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
  organizationIdentity: 'did:example:provider'
});

const negotiation = await adminClient.get('urn:rights-management:provider-neg-1');
const queryResult = await adminClient.query(
  DataspaceProtocolContractNegotiationStateType.REQUESTED,
  'cursor-1'
);

await adminClient.remove('urn:rights-management:provider-neg-1');

console.log(adminClient.className()); // PolicyNegotiationAdminPointRestClient
console.log(negotiation.state); // requested
console.log(queryResult.items.length); // 1
```
