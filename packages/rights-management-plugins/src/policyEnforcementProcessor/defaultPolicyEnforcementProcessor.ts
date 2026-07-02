// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is, ObjectHelper } from "@twin.org/core";
import { JsonPathHelper } from "@twin.org/data-json-path";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyDecision,
	type IPolicyDecision,
	type IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IDefaultPolicyEnforcementProcessorConstructorOptions } from "../models/IDefaultPolicyEnforcementProcessorConstructorOptions.js";

/**
 * Default Policy Enforcement Processor.
 */
export class DefaultPolicyEnforcementProcessor implements IPolicyEnforcementProcessor {
	/**
	 * The class name of the Default Policy Enforcement Processor.
	 */
	public static readonly CLASS_NAME: string = nameof<DefaultPolicyEnforcementProcessor>();

	/**
	 * Default set of top-level keys treated as document-structural fields.
	 */
	public static readonly DEFAULT_STRUCTURAL_KEYS: string[] = [
		"@context",
		"@type",
		"@id",
		"type",
		"id"
	];

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Keys unconditionally passed through from source to output.
	 * @internal
	 */
	private readonly _structuralKeys: string[];

	/**
	 * Create a new instance of DefaultPolicyEnforcementProcessor.
	 * @param options The options for the default policy enforcement processor.
	 */
	constructor(options?: IDefaultPolicyEnforcementProcessorConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._structuralKeys =
			options?.config?.structuralKeys ?? DefaultPolicyEnforcementProcessor.DEFAULT_STRUCTURAL_KEYS;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return DefaultPolicyEnforcementProcessor.CLASS_NAME;
	}

	/**
	 * Process the response from the policy decision point.
	 * @param agreement The agreement to process.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The data after processing.
	 */
	public async process<D = unknown, R = D>(
		agreement: IDataspaceProtocolAgreement,
		decisions: IPolicyDecision[],
		data?: D,
		action?: OdrlActionType | string
	): Promise<R> {
		Guards.object<IDataspaceProtocolAgreement>(
			DefaultPolicyEnforcementProcessor.CLASS_NAME,
			nameof(agreement),
			agreement
		);

		await this._logging?.log({
			level: "info",
			source: DefaultPolicyEnforcementProcessor.CLASS_NAME,
			ts: Date.now(),
			message: "processingPolicy",
			data: {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
			}
		});

		const isOriginalEmpty = Is.empty(data);
		const outputObject: R = (Is.arrayValue(data) ? [] : {}) as unknown as R;

		if (Is.arrayValue(decisions)) {
			// If this is a single simple decision with no values, handle that quickly.
			if (decisions.length === 1 && decisions[0].target === "$") {
				if (!Is.stringValue(decisions[0].target)) {
					throw new GeneralError(
						DefaultPolicyEnforcementProcessor.CLASS_NAME,
						"targetNotJsonPath",
						{ target: decisions[0].target }
					);
				}
				if (decisions[0].decision === PolicyDecision.Granted) {
					// Object granted, if original data is an object return it, otherwise return true.
					return isOriginalEmpty ? (true as R) : (data as unknown as R);
				} else if (
					decisions[0].decision === PolicyDecision.Replace &&
					Is.object(decisions[0].replaceValue)
				) {
					// Object replaced, return the replace value.
					return decisions[0].replaceValue as R;
				}

				// Object denied, or replace with no value
				// if original data is an object return empty object, otherwise return false.
				return isOriginalEmpty ? (false as R) : ({} as unknown as R);
			}

			for (const policyDecision of decisions) {
				if (!Is.stringValue(policyDecision.target)) {
					throw new GeneralError(
						DefaultPolicyEnforcementProcessor.CLASS_NAME,
						"targetNotJsonPath",
						{ target: policyDecision.target }
					);
				}

				if (
					policyDecision.decision === PolicyDecision.Replace &&
					Is.undefined(policyDecision.replaceValue)
				) {
					throw new GeneralError(
						DefaultPolicyEnforcementProcessor.CLASS_NAME,
						"replaceValueMissing",
						{ target: policyDecision.target }
					);
				}

				this.processDecision<D, R>(data, outputObject, policyDecision);
			}
			this.compactArrays(outputObject);

			// Well-known JSON-LD envelope fields carry document structure, not
			// access-controlled data. Pass them through unconditionally so that a policy
			// targeting only a nested array does not strip @context / type from the root.
			if (!isOriginalEmpty && Is.object(data) && Is.object(outputObject)) {
				for (const structuralKey of this._structuralKeys) {
					const structuralData = ObjectHelper.propertyGet(data, structuralKey);
					if (!Is.empty(structuralData)) {
						ObjectHelper.propertySet(outputObject, structuralKey, structuralData);
					}
				}
			}
		}

		return outputObject;
	}

	/**
	 * Remove undefined holes left by deleteAtLocation from every array in the object tree.
	 * @param obj The object to compact in place.
	 * @internal
	 */
	private compactArrays(obj: unknown): void {
		if (Is.array(obj)) {
			for (let i = obj.length - 1; i >= 0; i--) {
				if (Is.undefined(obj[i])) {
					obj.splice(i, 1);
				} else {
					this.compactArrays(obj[i]);
				}
			}
		} else if (Is.object(obj)) {
			for (const value of Object.values(obj)) {
				this.compactArrays(value);
			}
		}
	}

	/**
	 * Process a single policy decision.
	 * @param sourceObject The data to process.
	 * @param outputObject The currently processed object.
	 * @param policyDecision The policy decision to process.
	 * @throws GeneralError When replaceValue is missing or invalid.
	 * @internal
	 */
	private processDecision<D = unknown, R = D>(
		sourceObject: D | undefined,
		outputObject: R,
		policyDecision: IPolicyDecision
	): void {
		// If the target is "$" assume we are using the entire source object.
		if (policyDecision.target === "$") {
			const sourceKeys = Object.keys(sourceObject ?? {});
			const outputKeys = Object.keys(outputObject ?? {});

			if (policyDecision.decision === PolicyDecision.Granted) {
				for (const key of sourceKeys) {
					ObjectHelper.propertySet(outputObject, key, ObjectHelper.propertyGet(sourceObject, key));
				}
			} else if (policyDecision.decision === PolicyDecision.Replace) {
				// Replace everything, first remove all the current keys.
				for (const key of outputKeys) {
					ObjectHelper.propertyDelete(outputObject, key);
				}
				if (Is.objectValue(policyDecision.replaceValue)) {
					const replaceKeys = Object.keys(policyDecision.replaceValue);
					for (const key of replaceKeys) {
						ObjectHelper.propertySet(
							outputObject,
							key,
							ObjectHelper.propertyGet(policyDecision.replaceValue, key)
						);
					}
				}
			} else {
				// Denied everything, so remove all the properties.
				for (const key of sourceKeys) {
					ObjectHelper.propertyDelete(outputObject, key);
				}
			}
			return;
		}

		if (policyDecision.decision === PolicyDecision.Granted) {
			// We have a specific granted target (JSONPath), so copy all matching values into the output.
			const results = JsonPathHelper.query(policyDecision.target, sourceObject ?? {});
			for (const result of results) {
				JsonPathHelper.setAtLocation(outputObject, result.location, result.value);
			}
		} else if (policyDecision.decision === PolicyDecision.Replace) {
			// We have a specific replace target (JSONPath), so write replaceValue into all matching locations.
			const results = JsonPathHelper.query(policyDecision.target, sourceObject ?? {});
			for (const result of results) {
				JsonPathHelper.setAtLocation(outputObject, result.location, policyDecision.replaceValue);
			}
		} else {
			// We have a specific denied target (JSONPath), so remove all matching values from the output.
			const results = JsonPathHelper.query(policyDecision.target, outputObject);
			for (const result of results) {
				JsonPathHelper.deleteAtLocation(outputObject, result.location);
			}
		}
	}
}
