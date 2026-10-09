# Rights Management PNP Service Examples

These snippets walk through negotiation lifecycle operations from request creation to events, verification, and termination handling.

## PolicyNegotiationPointService

```typescript
import {
  PolicyNegotiationPointService,
  type IPolicyNegotiationPointServiceConstructorOptions
} from '@3sixty/rights-management-pnp-service';

const options: IPolicyNegotiationPointServiceConstructorOptions = {
  config: {
    callbackPath: 'callbacks/pnp'
  }
};

const pnp = new PolicyNegotiationPointService(options);

console.log(pnp.className()); // PolicyNegotiationPointService
```

```typescript
import {
  PolicyNegotiationPointService,
  type IPolicyNegotiationPointServiceConstructorOptions
} from '@3sixty/rights-management-pnp-service';
import {
  DataspaceProtocolContexts,
  DataspaceProtocolContractNegotiationTypes
} from '@3sixty/standards-dataspace-protocol';
import { OdrlTypes } from '@3sixty/standards-w3c-odrl';

const options: IPolicyNegotiationPointServiceConstructorOptions = {
  config: {
    callbackPath: 'callbacks/pnp'
  }
};

const pnp = new PolicyNegotiationPointService(options);
const trustPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

const providerNegotiationId = await pnp.sendRequestToProvider(
  'https://provider.example.com/pnp',
  'policy-requester',
  'urn:rights-management:offer-1',
  'https://consumer.example.com'
);

const negotiation = await pnp.getNegotiation(providerNegotiationId, trustPayload);

const requestResult = await pnp.requestFromConsumer(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
    consumerPid: 'urn:rights-management:consumer-neg-1',
    offer: {
      '@type': OdrlTypes.Offer,
      '@id': 'urn:rights-management:offer-1',
      assigner: 'did:example:provider'
    },
    callbackAddress: 'https://consumer.example.com/callbacks/pnp'
  },
  'https://provider.example.com',
  trustPayload
);

console.log(providerNegotiationId); // urn:rights-management:...
console.log(negotiation['@type']); // ContractNegotiation
console.log(requestResult['@type']); // ContractNegotiation
```

```typescript
import {
  PolicyNegotiationPointService,
  type IPolicyNegotiationPointServiceConstructorOptions
} from '@3sixty/rights-management-pnp-service';
import {
  DataspaceProtocolContexts,
  DataspaceProtocolContractNegotiationEventType,
  DataspaceProtocolContractNegotiationTypes
} from '@3sixty/standards-dataspace-protocol';

const options: IPolicyNegotiationPointServiceConstructorOptions = {
  config: {
    callbackPath: 'callbacks/pnp'
  }
};

const pnp = new PolicyNegotiationPointService(options);
const trustPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

const offerResult = await pnp.offerFromProvider(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1',
    offer: {
      '@id': 'urn:rights-management:offer-1',
      '@type': 'Offer',
      assigner: 'did:example:provider'
    }
  },
  'https://consumer.example.com',
  trustPayload
);

const agreementError = await pnp.agreementFromProvider(
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
  'https://consumer.example.com',
  trustPayload
);

const verificationError = await pnp.agreementVerificationFromConsumer(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractAgreementVerificationMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1'
  },
  'https://provider.example.com',
  trustPayload
);

const eventError = await pnp.event(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1',
    event: DataspaceProtocolContractNegotiationEventType.ACCEPTED
  },
  'provider',
  'https://provider.example.com',
  trustPayload
);

console.log(offerResult['@type']); // ContractNegotiation
console.log(agreementError); // undefined
console.log(verificationError); // undefined
console.log(eventError); // undefined
```

```typescript
import {
  PolicyNegotiationPointService,
  type IPolicyNegotiationPointServiceConstructorOptions
} from '@3sixty/rights-management-pnp-service';
import {
  DataspaceProtocolContexts,
  DataspaceProtocolContractNegotiationTypes
} from '@3sixty/standards-dataspace-protocol';

const options: IPolicyNegotiationPointServiceConstructorOptions = {
  config: {
    callbackPath: 'callbacks/pnp'
  }
};

const pnp = new PolicyNegotiationPointService(options);
const trustPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

const terminateError = await pnp.terminate(
  {
    '@context': [DataspaceProtocolContexts.Context],
    '@type': DataspaceProtocolContractNegotiationTypes.ContractNegotiationTerminationMessage,
    providerPid: 'urn:rights-management:provider-neg-1',
    consumerPid: 'urn:rights-management:consumer-neg-1'
  },
  'consumer',
  trustPayload
);

await pnp.sendTerminateToConsumer(
  'https://consumer.example.com/callbacks/pnp',
  'urn:rights-management:provider-neg-1',
  'urn:rights-management:consumer-neg-1'
);

console.log(terminateError); // undefined
```

## PolicyNegotiationAdminPointService

```typescript
import {
  PolicyNegotiationAdminPointService,
  type IPolicyNegotiationAdminPointServiceConstructorOptions
} from '@3sixty/rights-management-pnp-service';
import { DataspaceProtocolContractNegotiationStateType } from '@3sixty/standards-dataspace-protocol';

const options: IPolicyNegotiationAdminPointServiceConstructorOptions = {
  config: {
    negotiationStateTtlMinutes: 15
  }
};

const admin = new PolicyNegotiationAdminPointService(options);

await admin.start('logging');

await admin.set({
  id: 'urn:rights-management:provider-neg-1',
  correlationId: 'urn:rights-management:consumer-neg-1',
  dateCreated: new Date().toISOString(),
  state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
  organizationIdentity: 'did:example:provider'
});

const negotiation = await admin.get('urn:rights-management:provider-neg-1');
const queryResult = await admin.query(
  DataspaceProtocolContractNegotiationStateType.REQUESTED,
  'cursor-1'
);

await admin.remove('urn:rights-management:provider-neg-1');
await admin.stop('logging');

console.log(admin.className()); // PolicyNegotiationAdminPointService
console.log(negotiation.state); // requested
console.log(queryResult.items.length); // 1
```

## PolicyNegotiation

```typescript
import { PolicyNegotiation } from '@3sixty/rights-management-pnp-service';
import { DataspaceProtocolContractNegotiationStateType } from '@3sixty/standards-dataspace-protocol';

const negotiation = new PolicyNegotiation();
negotiation.id = 'urn:rights-management:provider-neg-1';
negotiation.correlationId = 'urn:rights-management:consumer-neg-1';
negotiation.dateCreated = new Date().toISOString();
negotiation.state = DataspaceProtocolContractNegotiationStateType.REQUESTED;
negotiation.organizationIdentity = 'did:example:provider';
negotiation.callbackAddress = 'https://consumer.example.com/callbacks/pnp';
negotiation.handlerId = 'policy-requester';

console.log(negotiation.id); // urn:rights-management:provider-neg-1
console.log(negotiation.state); // requested
```
