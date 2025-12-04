// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards } from "@twin.org/core";
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
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
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
		Guards.objectValue<IPolicyLocator>(
			IdentityPolicyInformationSource.CLASS_NAME,
			nameof(locator),
			locator
		);
		Guards.arrayOneOf(
			IdentityPolicyInformationSource.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.stringValue(
			IdentityPolicyInformationSource.CLASS_NAME,
			nameof(locator.assignee),
			locator.assignee
		);

		const information: IJsonLdNodeObject[] = [];

		try {
			await this._logging?.log({
				level: "info",
				source: IdentityPolicyInformationSource.CLASS_NAME,
				ts: Date.now(),
				message: "identityRetrieving",
				data: {
					locator: LocatorHelper.toString(locator)
				}
			});
			const idDoc = await this._identityResolver.identityResolve(locator.assignee);
			information.push(idDoc as unknown as IJsonLdNodeObject);
		} catch (err) {
			await this._logging?.log({
				level: "error",
				source: IdentityPolicyInformationSource.CLASS_NAME,
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
