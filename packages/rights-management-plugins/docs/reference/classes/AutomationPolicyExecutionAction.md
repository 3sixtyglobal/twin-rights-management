# Class: AutomationPolicyExecutionAction

Automation Policy Execution Action to execute automation policies.

## Implements

- `IPolicyExecutionAction`

## Constructors

### Constructor

> **new AutomationPolicyExecutionAction**(`options?`): `AutomationPolicyExecutionAction`

Create a new instance of AutomationPolicyExecutionAction.

#### Parameters

##### options?

[`IAutomationPolicyExecutionActionConstructorOptions`](../interfaces/IAutomationPolicyExecutionActionConstructorOptions.md)

The options for the automation policy execution action.

#### Returns

`AutomationPolicyExecutionAction`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Automation Policy Execution Action.

***

### BEFORE\_TRIGGER\_NAME {#before_trigger_name}

> `readonly` `static` **BEFORE\_TRIGGER\_NAME**: `string` = `"rights-management:pxp:before"`

The before automation trigger name.

***

### AFTER\_TRIGGER\_NAME {#after_trigger_name}

> `readonly` `static` **AFTER\_TRIGGER\_NAME**: `string` = `"rights-management:pxp:after"`

The after automation trigger name.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyExecutionAction.className`

***

### supportedStages() {#supportedstages}

> **supportedStages**(): `PolicyDecisionStage`[]

Which stages should the action be executed at.

#### Returns

`PolicyDecisionStage`[]

List of stages.

#### Implementation of

`IPolicyExecutionAction.supportedStages`

***

### execute() {#execute}

> **execute**\<`D`\>(`policy`, `decisions`, `data`, `action`, `stage`): `Promise`\<`void`\>

Execute function type for policy actions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IRightsManagementPolicy`

The policy that applied to the data.

##### decisions

`IPolicyDecision`[]

The decisions made by the PDP.

##### data

`D` \| `undefined`

The data to process.

##### action

`string` \| `undefined`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

##### stage

`PolicyDecisionStage`

The stage of the policy decision.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is complete.

#### Implementation of

`IPolicyExecutionAction.execute`
