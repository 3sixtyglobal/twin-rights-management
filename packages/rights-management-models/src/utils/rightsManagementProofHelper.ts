// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import { DidContexts, ProofTypes, type IProof } from "@twin.org/standards-w3c-did";
import type { IPolicyNegotiationRequest } from "../models/IPolicyNegotiationRequest";
import type { IPolicyRequest } from "../models/IPolicyRequest";
import { RightsManagementContexts } from "../models/rightsManagementContexts";
import { RightsManagementTypes } from "../models/rightsManagementTypes";

/**
 * Helper methods for creating and verifying rights management proofs.
 */
export class RightsManagementProofHelper {
	/**
	 * The class name of the Rights Management Proof Helper.
	 */
	public static readonly CLASS_NAME: string = nameof<RightsManagementProofHelper>();

	/**
	 * Create the proof for a specific action and asset type.
	 * @param identityConnector The identity connector to use for creating the proof.
	 * @param verificationMethodId The verification method id to use for creating the proof.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param assetType The type of the asset being accessed.
	 * @param action The action being performed.
	 * @param resourceId The specific resource id or can be left undefined for a whole asset class.
	 * @returns The proof object.
	 * @throws GeneralError is the proof creation fails.
	 */
	public static async createProofNegotiation(
		identityConnector: IIdentityConnector,
		verificationMethodId: string,
		nodeIdentity: string,
		assetType: string,
		action: string,
		resourceId: string | undefined
	): Promise<IProof> {
		Guards.object<IIdentityConnector>(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(action), action);

		const unsecureDocument: Omit<IPolicyNegotiationRequest, "proof"> = {
			"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assetType,
			action,
			resourceId,
			nodeIdentity
		};

		return await identityConnector.createProof(
			nodeIdentity,
			verificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecureDocument as unknown as IJsonLdNodeObject
		);
	}

	/**
	 * Create the proof for a policy id.
	 * @param identityConnector The identity connector to use for creating the proof.
	 * @param verificationMethodId The verification method id to use for creating the proof.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param policyId The id of the policy being accessed.
	 * @returns The proof object.
	 * @throws GeneralError is the proof creation fails.
	 */
	public static async createProofPolicyId(
		identityConnector: IIdentityConnector,
		verificationMethodId: string,
		nodeIdentity: string,
		policyId: string
	): Promise<IProof> {
		Guards.object<IIdentityConnector>(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(policyId), policyId);

		const unsecureDocument: Omit<IPolicyRequest, "proof"> = {
			"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
			type: RightsManagementTypes.PolicyRequest,
			id: policyId,
			nodeIdentity
		};

		return await identityConnector.createProof(
			nodeIdentity,
			verificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecureDocument as unknown as IJsonLdNodeObject
		);
	}

	/**
	 * Verify the proof for a specific action and asset type.
	 * @param identityConnector The identity connector to use for verifying the proof.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param assetType The type of the asset being accessed.
	 * @param action The action being performed.
	 * @param resourceId The specific resource id or can be left undefined for a whole asset class.
	 * @param proof The proof object containing the necessary information.
	 * @param proofTtlInSeconds The time-to-live (TTL) for the proof in seconds.
	 * @throws GeneralError is the proof verification fails.
	 */
	public static async verifyProofNegotiation(
		identityConnector: IIdentityConnector,
		nodeIdentity: string,
		assetType: string,
		action: string,
		resourceId: string | undefined,
		proof: IProof,
		proofTtlInSeconds: number
	): Promise<void> {
		Guards.object<IIdentityConnector>(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(action), action);
		Guards.objectValue<IProof>(RightsManagementProofHelper.CLASS_NAME, nameof(proof), proof);

		await RightsManagementProofHelper.verifyCreated(proof, nodeIdentity, proofTtlInSeconds);

		const proofDocument: Omit<IPolicyNegotiationRequest, "proof"> = {
			"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assetType,
			action,
			resourceId,
			nodeIdentity
		};

		const isValid = await identityConnector.verifyProof(
			proofDocument as unknown as IJsonLdNodeObject,
			proof
		);

		if (!isValid) {
			throw new GeneralError(RightsManagementProofHelper.CLASS_NAME, "proofNegotiationFailed", {
				assetType,
				action,
				nodeIdentity
			});
		}
	}

	/**
	 * Verify the proof for a policy id.
	 * @param identityConnector The identity connector to use for verifying the proof.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param policyId The id of the policy being accessed.
	 * @param proof The proof object containing the necessary information.
	 * @param proofTtlInSeconds The time-to-live (TTL) for the proof in seconds.
	 * @throws GeneralError is the proof verification fails.
	 */
	public static async verifyProofPolicyId(
		identityConnector: IIdentityConnector,
		nodeIdentity: string,
		policyId: string,
		proof: IProof,
		proofTtlInSeconds: number
	): Promise<void> {
		Guards.object<IIdentityConnector>(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(identityConnector),
			identityConnector
		);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(policyId), policyId);
		Guards.objectValue<IProof>(RightsManagementProofHelper.CLASS_NAME, nameof(proof), proof);

		await RightsManagementProofHelper.verifyCreated(proof, nodeIdentity, proofTtlInSeconds);

		const proofDocument: Omit<IPolicyRequest, "proof"> = {
			"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
			type: RightsManagementTypes.PolicyRequest,
			id: policyId,
			nodeIdentity
		};

		const isValid = await identityConnector.verifyProof(
			proofDocument as unknown as IJsonLdNodeObject,
			proof
		);

		if (!isValid) {
			throw new GeneralError(RightsManagementProofHelper.CLASS_NAME, "proofPolicyIdFailed", {
				policyId,
				nodeIdentity
			});
		}
	}

	/**
	 * Verify that the proof has a created date and that it is within the allowed time-to-live (TTL).
	 * @param proof The proof object to verify.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param proofTtlInSeconds The time-to-live (TTL) for the proof in seconds.
	 * @throws GeneralError if the proof is missing the created date or if it has expired.
	 */
	public static async verifyCreated(
		proof: IProof,
		nodeIdentity: string,
		proofTtlInSeconds: number
	): Promise<void> {
		Guards.objectValue<IProof>(RightsManagementProofHelper.CLASS_NAME, nameof(proof), proof);
		Guards.stringValue(RightsManagementProofHelper.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.number(
			RightsManagementProofHelper.CLASS_NAME,
			nameof(proofTtlInSeconds),
			proofTtlInSeconds
		);

		if (Is.empty(proof.created)) {
			throw new GeneralError(RightsManagementProofHelper.CLASS_NAME, "proofMissingCreated", {
				nodeIdentity
			});
		}

		const proofCreated = new Date(proof.created);
		const now = Date.now();
		const proofTtlInMs = proofTtlInSeconds * 1000;

		// If the proof has expired then we should reject it
		if (proofCreated.getTime() + proofTtlInMs < now) {
			throw new GeneralError(RightsManagementProofHelper.CLASS_NAME, "proofExpired", {
				nodeIdentity
			});
		}
	}
}
