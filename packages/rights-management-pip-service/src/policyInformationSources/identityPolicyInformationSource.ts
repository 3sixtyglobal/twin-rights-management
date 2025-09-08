// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, type IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IIdentityResolverComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
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
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<IJsonLdNodeObject[] | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);

		const information: IJsonLdNodeObject[] = [];

		try {
			this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "identityRetrieving",
				data: {
					assetType,
					action,
					identity: nodeIdentity
				}
			});
			const idDoc = await this._identityResolver.identityResolve(nodeIdentity);
			information.push(idDoc as unknown as IJsonLdNodeObject);
		} catch (err) {
			this._logging?.log({
				level: "error",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "identityRetrievalFailed",
				data: {
					assetType,
					action,
					identity: nodeIdentity
				},
				error: BaseError.fromError(err)
			});
		}

		return information;
	}
}
