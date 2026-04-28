// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationComponent } from "@twin.org/automation-models";
import { ComponentFactory } from "@twin.org/core";
import { PolicyDecisionStage } from "@twin.org/rights-management-models";
import { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IAutomationPolicyExecutionActionConstructorOptions } from "../../src/models/IAutomationPolicyExecutionActionConstructorOptions.js";
import { AutomationPolicyExecutionAction } from "../../src/policyExecutionActions/automationPolicyExecutionAction.js";

// Mock automation component
const mockTrigger = vi.fn();

describe("AutomationPolicyExecutionAction", () => {
	beforeEach(() => {
		mockTrigger.mockClear();
		// Register the mock automation component for the tests
		ComponentFactory.register(
			"automation",
			() => ({ trigger: mockTrigger }) as unknown as IAutomationComponent
		);
	});

	it("should use default trigger action if none provided", async () => {
		const action = new AutomationPolicyExecutionAction();
		await action.execute(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Policy",
				"@id": "policy1"
			},
			[],
			undefined,
			OdrlActionType.Inform,
			PolicyDecisionStage.Before
		);
		expect(mockTrigger).toHaveBeenCalledWith(
			"rights-management:pxp:before",
			expect.objectContaining({ action: OdrlActionType.Inform })
		);
	});

	it("should not trigger if action not in triggerActions", async () => {
		const options: IAutomationPolicyExecutionActionConstructorOptions = {
			config: { triggerActions: [OdrlActionType.Use] }
		};
		const action = new AutomationPolicyExecutionAction(options);
		await action.execute(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Policy",
				"@id": "policy1"
			},
			[],
			undefined,
			OdrlActionType.Inform,
			PolicyDecisionStage.After
		);
		expect(mockTrigger).not.toHaveBeenCalled();
	});

	it("should trigger for configured action", async () => {
		const options: IAutomationPolicyExecutionActionConstructorOptions = {
			config: { triggerActions: [OdrlActionType.Delete] }
		};
		const action = new AutomationPolicyExecutionAction(options);
		await action.execute(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Policy",
				"@id": "policy1"
			},
			[],
			undefined,
			OdrlActionType.Delete,
			PolicyDecisionStage.After
		);
		expect(mockTrigger).toHaveBeenCalledWith(
			"rights-management:pxp:after",
			expect.objectContaining({ action: OdrlActionType.Delete })
		);
	});

	it("should support both Before and After stages", () => {
		const action = new AutomationPolicyExecutionAction();
		const stages = action.supportedStages();
		expect(stages).toContain(PolicyDecisionStage.Before);
		expect(stages).toContain(PolicyDecisionStage.After);
	});

	it("should return correct class name", () => {
		const action = new AutomationPolicyExecutionAction();
		expect(action.className()).toBe("AutomationPolicyExecutionAction");
	});
});
