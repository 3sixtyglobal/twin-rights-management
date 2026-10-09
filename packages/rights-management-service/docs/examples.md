# Rights Management Service Examples

These snippets show how to compose route collections and expose entry points for hosting components without wiring routes manually.

## Route Generators

```typescript
import {
  generateRestRoutesPolicyAdministrationPoint,
  generateRestRoutesPolicyNegotiationAdminPoint,
  generateRestRoutesPolicyNegotiationPoint,
  papTags,
  pnapTags,
  pnpTags
} from '@3sixty/rights-management-service';

const papRoutes = generateRestRoutesPolicyAdministrationPoint(
  '/rights-management',
  'policy-administration-point'
);
const pnapRoutes = generateRestRoutesPolicyNegotiationAdminPoint(
  '/rights-management',
  'policy-negotiation-admin-point'
);
const pnpRoutes = generateRestRoutesPolicyNegotiationPoint(
  '/rights-management',
  'policy-negotiation-point'
);

console.log(papRoutes.length); // 8
console.log(pnapRoutes.length); // 4
console.log(pnpRoutes.length); // 8
console.log(papTags[0].name); // Policy Administration Point
console.log(pnapTags[0].name); // Policy Negotiation Administration Point
console.log(pnpTags[0].name); // Policy Negotiation Point
```

## REST Entry Points

```typescript
import { restEntryPoints } from '@3sixty/rights-management-service';

const entryNames = restEntryPoints.map(entry => entry.name);

console.log(entryNames); // [ 'policy-administration-point', 'policy-negotiation-point', 'policy-negotiation-admin-point' ]
console.log(restEntryPoints[0].defaultBaseRoute); // rights-management
```
