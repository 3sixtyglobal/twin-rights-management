// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, type IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IIdentityResolverComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformationSource,
	type IPolicyLocator,
	LocatorHelper,
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
	 * @param locator The locator to find relevant policies.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param policies The policies that apply to the data.
	 * @param data The data to process.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<D = unknown>(
		locator: IPolicyLocator,
		accessMode: PolicyInformationAccessMode,
		policies: IOdrlPolicy[],
		data?: D
	): Promise<IJsonLdNodeObject[] | undefined> {
		Guards.objectValue<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);
		Guards.arrayOneOf(
			this.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.stringValue(this.CLASS_NAME, nameof(locator.assignee), locator.assignee);

		const information: IJsonLdNodeObject[] = [];

		try {
			this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "identityRetrieving",
				data: {
					locator: LocatorHelper.toString(locator)
				}
			});
			const idDoc = await this._identityResolver.identityResolve(locator.assignee);
			information.push(idDoc as unknown as IJsonLdNodeObject);
		} catch (err) {
			this._logging?.log({
				level: "error",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "identityRetrievalFailed",
				data: {
					locator: LocatorHelper.toString(locator)
				},
				error: BaseError.fromError(err)
			});
		}

		return information;
	}
}
