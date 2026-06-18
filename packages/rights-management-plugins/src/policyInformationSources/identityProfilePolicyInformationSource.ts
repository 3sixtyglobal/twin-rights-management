// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is, NotFoundError } from "@twin.org/core";
import { type IJsonLdNodeObject, JsonLdHelper } from "@twin.org/data-json-ld";
import type { IIdentityProfileComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyInformationAccessMode,
	type IPolicyInformationSource,
	type IRightsManagementInformation,
	type IRightsManagementPolicy
} from "@twin.org/rights-management-models";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IIdentityProfilePolicyInformationSourceConstructorOptions } from "../models/IIdentityProfilePolicyInformationSourceConstructorOptions.js";

/**
 * Policy information source which retrieves identity profile information.
 */
export class IdentityProfilePolicyInformationSource implements IPolicyInformationSource {
	/**
	 * The class name of the Identity Profile Policy Information Source.
	 */
	public static readonly CLASS_NAME: string = nameof<IdentityProfilePolicyInformationSource>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The identity profile component.
	 * @internal
	 */
	private readonly _identityProfile: IIdentityProfileComponent;

	/**
	 * Create a new instance of IdentityProfilePolicyInformationSource.
	 * @param options The options for the identity profile policy source.
	 */
	constructor(options?: IIdentityProfilePolicyInformationSourceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._identityProfile = ComponentFactory.get(
			options?.identityProfileComponentType ?? "identity-profile"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IdentityProfilePolicyInformationSource.CLASS_NAME;
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
			IdentityProfilePolicyInformationSource.CLASS_NAME,
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
						source: IdentityProfilePolicyInformationSource.CLASS_NAME,
						ts: Date.now(),
						message: "profileRetrieving",
						data: {
							policyId: OdrlPolicyHelper.getUid(policy) ?? "",
							id
						}
					});

					const profile = (information.profile as { [id: string]: IJsonLdNodeObject }) ?? {};

					if (accessMode === PolicyInformationAccessMode.Public) {
						const publicProfile = await this._identityProfile.getPublic(id);
						profile[id] = {
							public: Is.object(publicProfile)
								? JsonLdHelper.toNodeObject(publicProfile)
								: undefined
						};
					} else {
						const result = await this._identityProfile.get(undefined, undefined, id);
						profile[id] = {
							public: Is.object(result.publicProfile)
								? JsonLdHelper.toNodeObject(result.publicProfile)
								: undefined,
							private: Is.object(result.privateProfile)
								? JsonLdHelper.toNodeObject(result.privateProfile)
								: undefined
						};
					}
					information.profile = profile;
				} catch (err) {
					if (!BaseError.someErrorName(err, NotFoundError.CLASS_NAME)) {
						await this._logging?.log({
							level: "error",
							source: IdentityProfilePolicyInformationSource.CLASS_NAME,
							ts: Date.now(),
							message: "profileRetrievalFailed",
							data: {
								policyId: OdrlPolicyHelper.getUid(policy) ?? "",
								id
							},
							error: BaseError.fromError(err)
						});
					}
				}
			}
		}

		return information;
	}
}
