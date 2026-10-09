// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is } from "@3sixty/core";
import { JsonLdHelper } from "@3sixty/data-json-ld";
import type { IIdentityResolverComponent } from "@3sixty/identity-models";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import {
	type IPolicyInformationSource,
	type IRightsManagementInformation,
	type IRightsManagementPolicy,
	OdrlPolicyHelper,
	PolicyInformationAccessMode
} from "@3sixty/rights-management-models";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IIdentityPolicyInformationSourceConstructorOptions } from "../models/IIdentityPolicyInformationSourceConstructorOptions.js";

/**
 * Policy information source which retrieves the identity information.
 */
export class IdentityPolicyInformationSource implements IPolicyInformationSource {
	/**
	 * The class name of the Identity Policy Information Source.
	 */
	public static readonly CLASS_NAME: string = nameof<IdentityPolicyInformationSource>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The identity resolver component.
	 * @internal
	 */
	private readonly _identityResolver: IIdentityResolverComponent;

	/**
	 * Create a new instance of IdentityPolicyInformationSource.
	 * @param options The options for the logging policy source.
	 */
	constructor(options?: IIdentityPolicyInformationSourceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._identityResolver = ComponentFactory.get(
			options?.identityResolverComponentType ?? "identity-resolver"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IdentityPolicyInformationSource.CLASS_NAME;
	}

	/**
	 * Retrieve information from the sources.
	 * @param policy The policy to retrieve information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to process.
	 * @param action The action that was evaluated.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<D = unknown>(
		policy: IRightsManagementPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D,
		action?: OdrlActionType | string
	): Promise<IRightsManagementInformation | undefined> {
		Guards.arrayOneOf(
			IdentityPolicyInformationSource.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);

		const information: IRightsManagementInformation = {};

		if (Is.object<IRightsManagementPolicy>(policy)) {
			const ids = [];

			if (Is.stringValue(policy.assignee)) {
				ids.push(policy.assignee);
			}
			if (Is.stringValue(policy.assigner)) {
				ids.push(policy.assigner);
			}

			for (const id of ids) {
				try {
					await this._logging?.log({
						level: "info",
						source: IdentityPolicyInformationSource.CLASS_NAME,
						ts: Date.now(),
						message: "identityRetrieving",
						data: {
							policyId: OdrlPolicyHelper.getUid(policy) ?? "",
							id
						}
					});
					const idDoc = await this._identityResolver.identityResolve(id);
					information[id] = JsonLdHelper.toNodeObject(idDoc);
				} catch (err) {
					await this._logging?.log({
						level: "error",
						source: IdentityPolicyInformationSource.CLASS_NAME,
						ts: Date.now(),
						message: "identityRetrievalFailed",
						data: {
							policyId: OdrlPolicyHelper.getUid(policy) ?? "",
							id
						},
						error: BaseError.fromError(err)
					});
				}
			}
		}

		return information;
	}
}
