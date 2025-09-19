// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards, Is, ObjectHelper } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { DocumentHelper, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	type IDidVerifiableCredential,
	VerifiableCredentialHelper
} from "@twin.org/standards-w3c-did";

/**
 * Helper methods for creating and verifying rights managements requests.
 */
export class RightsManagementTokenHelper {
	/**
	 * The class name of the Rights Management Token Helper.
	 */
	public static readonly CLASS_NAME: string = nameof<RightsManagementTokenHelper>();

	/**
	 * Create the token for an object.
	 * @param identityConnector The identity connector to use for creating the token.
	 * @param verificationMethodId The verification method id to use for creating the token.
	 * @param item The item to create the token for.
	 * @param tokenTtlInSeconds The time-to-live (TTL) for the token in seconds.
	 * @returns The token.
	 * @throws GeneralError is the token creation fails.
	 */
	public static async createToken<
		T extends {
			"@context": unknown;
		}
	>(
		identityConnector: IIdentityConnector,
		verificationMethodId: string,
		item: T,
		tokenTtlInSeconds: number
	): Promise<string> {
		Guards.object<IIdentityConnector>(
			RightsManagementTokenHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(
			RightsManagementTokenHelper.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.integer(
			RightsManagementTokenHelper.CLASS_NAME,
			nameof(tokenTtlInSeconds),
			tokenTtlInSeconds
		);

		const ttlMs = tokenTtlInSeconds * 1000;

		const parts = DocumentHelper.parseId(verificationMethodId);

		const credential = await identityConnector.createVerifiableCredential(
			parts.id,
			verificationMethodId,
			undefined,
			item as unknown as IJsonLdNodeObject,
			{
				expirationDate: new Date(Date.now() + ttlMs)
			}
		);

		return credential.jwt;
	}

	/**
	 * Verify the token.
	 * @param identityConnector The identity connector to use for verifying the token.
	 * @param checkProperties Properties to compare against the subject to see if they match.
	 * @param token The token containing the necessary information.
	 * @param tokenTtlInSeconds The time-to-live (TTL) for the token in seconds.
	 * @returns The verifiable credential if the token is valid.
	 * @throws GeneralError is the token verification fails.
	 */
	public static async verifyToken(
		identityConnector: IIdentityConnector,
		checkProperties: object,
		token: string,
		tokenTtlInSeconds: number
	): Promise<Omit<IDidVerifiableCredential, "issuer"> & { issuer: string }> {
		Guards.object<IIdentityConnector>(
			RightsManagementTokenHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(RightsManagementTokenHelper.CLASS_NAME, nameof(token), token);

		try {
			const result = await identityConnector.checkVerifiableCredential(token);

			const verifiableCredential = result.verifiableCredential;
			if (Is.empty(verifiableCredential)) {
				throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenNoCredential");
			}

			const issuer: string | undefined = Is.stringValue(verifiableCredential.issuer)
				? verifiableCredential.issuer
				: undefined;
			if (Is.empty(issuer)) {
				throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenNoIssuer");
			}

			for (const checkProperty of Object.keys(checkProperties)) {
				if (
					ObjectHelper.propertyGet(checkProperties, checkProperty) !==
					ObjectHelper.propertyGet(verifiableCredential.credentialSubject, checkProperty)
				) {
					throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenItemMismatch", {
						property: checkProperty
					});
				}
			}

			await RightsManagementTokenHelper.verifyIssuanceDate(
				VerifiableCredentialHelper.getValidFrom(verifiableCredential),
				issuer,
				tokenTtlInSeconds
			);

			return {
				...verifiableCredential,
				issuer
			};
		} catch (err) {
			throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenFailed", undefined, err);
		}
	}

	/**
	 * Verify that the token has an issuance date and that it is within the allowed time-to-live (TTL).
	 * @param issuanceDate The issuance date from the token.
	 * @param assignee The identity of the node performing the action.
	 * @param tokenTtlInSeconds The time-to-live (TTL) for the token in seconds.
	 * @throws GeneralError if the token is missing the issuance date or if it has expired.
	 */
	public static async verifyIssuanceDate(
		issuanceDate: string | undefined,
		assignee: string,
		tokenTtlInSeconds: number
	): Promise<void> {
		Guards.stringValue(RightsManagementTokenHelper.CLASS_NAME, nameof(assignee), assignee);
		Guards.number(
			RightsManagementTokenHelper.CLASS_NAME,
			nameof(tokenTtlInSeconds),
			tokenTtlInSeconds
		);

		if (Is.empty(issuanceDate)) {
			throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenMissingIssuanceDate", {
				assignee
			});
		}

		const tokenCreated = new Date(issuanceDate);
		const now = Date.now();
		const tokenTtlInMs = tokenTtlInSeconds * 1000;

		// If the token has expired then we should reject it
		if (tokenCreated.getTime() + tokenTtlInMs < now) {
			throw new GeneralError(RightsManagementTokenHelper.CLASS_NAME, "tokenExpired", {
				assignee
			});
		}
	}
}
