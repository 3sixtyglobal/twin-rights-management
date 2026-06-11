# Function: buildStorageContext()

> **buildStorageContext**(`policy`): `OdrlContextType`

Builds the stored JSON-LD context for a policy that will have lifecycle timestamps.

## Parameters

### policy

`IRightsManagementPolicy`

The policy being persisted.

## Returns

`OdrlContextType`

The context to persist, with lifecycle term definitions included.
