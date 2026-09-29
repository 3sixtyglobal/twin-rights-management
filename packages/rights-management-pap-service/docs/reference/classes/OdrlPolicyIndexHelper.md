# Class: OdrlPolicyIndexHelper

Helper methods for building ODRL policy index entries.

## Constructors

### Constructor

> **new OdrlPolicyIndexHelper**(): `OdrlPolicyIndexHelper`

#### Returns

`OdrlPolicyIndexHelper`

## Methods

### createIndexEntry() {#createindexentry}

> `static` **createIndexEntry**(`policyId`, `dateCreated`, `assigner?`, `assignee?`, `target?`, `action?`): [`OdrlPolicyIndex`](OdrlPolicyIndex.md)

Create the index entry for one combination of assigner, assignee, target and action. The
values are case folded and hashed, and the id is derived from the policy id and values so the
same combination always produces the same id.

#### Parameters

##### policyId

`string`

The id of the policy the entry refers to.

##### dateCreated

`string`

The creation date of the policy.

##### assigner?

`string`

The assigner party id.

##### assignee?

`string`

The assignee party id.

##### target?

`string`

The target asset id.

##### action?

`string`

The action identifier.

#### Returns

[`OdrlPolicyIndex`](OdrlPolicyIndex.md)

The index entry.

***

### hashValue() {#hashvalue}

> `static` **hashValue**(`value?`): `string` \| `undefined`

Hash an index value so the composite index key has a fixed size whatever the value length.
The value is case folded first so lookups are case insensitive.

#### Parameters

##### value?

`string`

The value to hash.

#### Returns

`string` \| `undefined`

The base64 url encoded Blake2b-160 hash, or undefined when there is no value.
