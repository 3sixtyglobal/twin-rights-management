# Function: convertToStoragePolicy()

> **convertToStoragePolicy**\<`T`\>(`policy`, `metadata?`, `context?`): [`OdrlPolicy`](../classes/OdrlPolicy.md)

Converts an IDataspaceProtocolPolicy to an OdrlPolicy for storage.

## Type Parameters

### T

`T` *extends* `IRightsManagementPolicy`

## Parameters

### policy

`T`

The policy to convert.

### metadata?

`IRightsManagementPolicyMetadata`

PAP-managed lifecycle metadata.

### context?

`OdrlContextType`

Server-controlled JSON-LD context to persist.

## Returns

[`OdrlPolicy`](../classes/OdrlPolicy.md)

The converted policy.
