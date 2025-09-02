// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, type IComponent, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IIdentityResolverComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyContext,
	IPolicyInformationSource,
	PolicyInformationAccessMode
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IIdentityPolicyInformationSourceConstructorOptions } from "../models/IIdentityPolicyInformationSourceConstructorOptions";

/**
 * Policy information source which retrieves the identity information.
 */
export class IdentityPolicyInformationSource implements IPolicyInformationSource, IComponent {
	/**
	 * The class name of the Identity Policy Information Source.
	 */
	public readonly CLASS_NAME: string = nameof<IdentityPolicyInformationSource>();

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
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._identityResolver = ComponentFactory.get<IIdentityResolverComponent>(
			options?.identityResolverComponentType ?? "identity-resolver"
		);
	}

	/**
	 * Retrieve information from the sources.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		context: C | undefined,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<IJsonLdNodeObject[] | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const information: IJsonLdNodeObject[] = [];
		const userIdentity = context?.userIdentity;
		const nodeIdentity = context?.nodeIdentity;

		const lookupIdentities = [];
		if (Is.stringValue(userIdentity)) {
			lookupIdentities.push(userIdentity);
		}
		if (Is.stringValue(nodeIdentity) && userIdentity !== nodeIdentity) {
			lookupIdentities.push(nodeIdentity);
		}

		for (const identity of lookupIdentities) {
			if (Is.stringValue(identity)) {
				try {
					this._logging?.log({
						level: "info",
						source: this.CLASS_NAME,
						ts: Date.now(),
						message: "identityRetrieving",
						data: {
							assetType,
							action,
							identity
						}
					});
					const userDoc = await this._identityResolver.identityResolve(identity);
					information.push(userDoc as unknown as IJsonLdNodeObject);
				} catch (err) {
					this._logging?.log({
						level: "error",
						source: this.CLASS_NAME,
						ts: Date.now(),
						message: "identityRetrievalFailed",
						data: {
							assetType,
							action,
							identity
						},
						error: BaseError.fromError(err)
					});
				}
			}
		}
		return information;
	}
}
