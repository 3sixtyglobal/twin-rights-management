# Class: OdrlPolicyHelper

Helper methods for Odrl Policies.

## Constructors

### Constructor

> **new OdrlPolicyHelper**(): `OdrlPolicyHelper`

#### Returns

`OdrlPolicyHelper`

## Methods

### findExpirationDate()

> `static` **findExpirationDate**(`policy`, `assetType?`, `action?`): `undefined` \| `string`

Find the expiration date of the policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to check.

##### assetType?

`string`

The type of the asset, if undefined will match any asset type.

##### action?

`string`

The action to check, if undefined will match any action.

#### Returns

`undefined` \| `string`

The expiration date of the policy, or undefined if not found.

***

### matchAsset()

> `static` **matchAsset**(`target?`, `matchAssetType?`): `boolean`

Match the target to the requested asset type.

#### Parameters

##### target?

The target to match.

`string` | `IOdrlAsset` | (`string` \| `IOdrlAsset`)[]

##### matchAssetType?

`string`

The asset type to match.

#### Returns

`boolean`

True if the target is empty, the target matches the requested asset, false otherwise.

***

### matchAction()

> `static` **matchAction**(`action?`, `matchAction?`): `boolean`

Match the action to the asset type.

#### Parameters

##### action?

The action to match.

`ActionType` | `IOdrlAction` | ActionType \| IOdrlAction[]

##### matchAction?

`string`

The action to match.

#### Returns

`boolean`

True if the action is empty, the action matches the asset type, false otherwise.

***

### matchTargetAndAction()

> `static` **matchTargetAndAction**(`target?`, `action?`, `matchAssetType?`, `matchAction?`): `boolean`

Match the target and action to the requested asset type and action.

#### Parameters

##### target?

The target to match.

`string` | `IOdrlAsset` | (`string` \| `IOdrlAsset`)[]

##### action?

The action to match.

`ActionType` | `IOdrlAction` | ActionType \| IOdrlAction[]

##### matchAssetType?

`string`

The asset type to match.

##### matchAction?

`string`

The action to match.

#### Returns

`boolean`

True if the target and action match the requested asset type and action, false otherwise.
