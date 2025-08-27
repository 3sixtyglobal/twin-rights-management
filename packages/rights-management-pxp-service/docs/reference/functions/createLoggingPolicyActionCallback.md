# Function: createLoggingPolicyActionCallback()

> **createLoggingPolicyActionCallback**(`loggingComponentType`, `options?`): `PolicyActionCallback`

Create a callback for use with the PXP that logs policy actions.

## Parameters

### loggingComponentType

`string`

The logging component to use for logging.

### options?

Options for the logger.

#### stages?

`PolicyDecisionStage`[]

The policy decision stages to log, if undefined defaults to all.

#### includeData?

`boolean`

Whether to include the data in the log.

#### includePolicies?

`boolean`

Whether to include the policies in the log.

## Returns

`PolicyActionCallback`

The instance of the callback.
