// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter } from "@twin.org/core";
import type { IIdentityConnector } from "@twin.org/identity-models";
import { ProofHelper, type IDataIntegrityProof } from "@twin.org/standards-w3c-did";
import type { IJwk } from "@twin.org/web";
import { RightsManagementProofHelper } from "../src/utils/rightsManagementProofHelper";

describe("RightsManagementProofHelper", () => {
	const MOCK_TIME = 1724327816272;
	Date.now = vi.fn().mockImplementation(() => MOCK_TIME);

	const jwk: IJwk = {
		kty: "OKP",
		crv: "Ed25519",
		x: Converter.bytesToBase64Url(
			Converter.hexToBytes("e734ea6c2b6257de72355e472aa05a4c487e6b463c029ed306df2f01b5636b58")
		),
		d: Converter.bytesToBase64Url(
			Converter.hexToBytes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
		)
	};
	const mockIdentityConnector: IIdentityConnector = {
		createProof: vi.fn(async (nodeIdentity, verificationMethodId, proofType, document) => {
			const unsignedProof = ProofHelper.createUnsignedProof(proofType, verificationMethodId);
			return ProofHelper.createProof(proofType, document, unsignedProof, jwk);
		}),
		verifyProof: vi.fn(async (document, proof) => {
			const signerVerifier = ProofHelper.createSignerVerifier(proof.type);
			return signerVerifier.verifyProof(document, proof, jwk);
		}),
		createDocument: vi.fn(),
		removeDocument: vi.fn(),
		addVerificationMethod: vi.fn(),
		removeVerificationMethod: vi.fn(),
		addService: vi.fn(),
		removeService: vi.fn(),
		createVerifiableCredential: vi.fn(),
		checkVerifiableCredential: vi.fn(),
		createVerifiablePresentation: vi.fn(),
		checkVerifiablePresentation: vi.fn(),
		revokeVerifiableCredentials: vi.fn(),
		unrevokeVerifiableCredentials: vi.fn(),
		CLASS_NAME: "MockIdentityConnector"
	};

	const expiredProof: IDataIntegrityProof = {
		"@context": [
			"https://www.w3.org/ns/credentials/v2",
			"https://schema.twindev.org/rights-management"
		],
		type: "DataIntegrityProof",
		cryptosuite: "eddsa-jcs-2022",
		created: new Date(MOCK_TIME - 3600000).toISOString(), // 1 hour ago
		verificationMethod: "did:example:123#key-1",
		proofPurpose: "assertionMethod",
		proofValue:
			"z525x2V6FZwRqaXpJtFyBDRHXxHNrQ6GkkvL1igRoyMvHNfs9Vmbj5rpphtgyqeGY5saMvh9SHzfcR4rkaMEW4vCo"
	};

	const validNegotiationProof: IDataIntegrityProof = {
		"@context": [
			"https://www.w3.org/ns/credentials/v2",
			"https://schema.twindev.org/rights-management"
		],
		type: "DataIntegrityProof",
		cryptosuite: "eddsa-jcs-2022",
		created: "2024-08-22T11:56:56.272Z",
		verificationMethod: "did:example:123#key-1",
		proofPurpose: "assertionMethod",
		proofValue:
			"z5xUxFxjwnoS4RKyM421JEB5cUMDv1uU9kHQeuiokJgBzk4ZUiRkanW67HBL6q3Y3kQUrpqgc7gBw8JA3ktLxifCw"
	};

	const validPolicyIdProof: IDataIntegrityProof = {
		"@context": [
			"https://www.w3.org/ns/credentials/v2",
			"https://schema.twindev.org/rights-management"
		],
		type: "DataIntegrityProof",
		cryptosuite: "eddsa-jcs-2022",
		created: "2024-08-22T11:56:56.272Z",
		verificationMethod: "did:example:123#key-1",
		proofPurpose: "assertionMethod",
		proofValue:
			"zwmwozUs8t63WoiUV7H5Vk9o5ovD2swNNWwWPmFJwKQr99YfwMN7H613VnETbLoboDk4y9ZZi7Z8EpapS3Fkv86p"
	};

	it("should create a negotiation proof", async () => {
		const proof = await RightsManagementProofHelper.createProofNegotiation(
			mockIdentityConnector,
			"did:example:123#key-1",
			{
				assignee: "did:example:123",
				assetType: "assetType",
				action: "read",
				resourceId: "resource-1"
			}
		);
		expect(proof).toHaveProperty("created");
		expect(proof).toHaveProperty(
			"proofValue",
			"z5xUxFxjwnoS4RKyM421JEB5cUMDv1uU9kHQeuiokJgBzk4ZUiRkanW67HBL6q3Y3kQUrpqgc7gBw8JA3ktLxifCw"
		);
		expect(mockIdentityConnector.createProof).toHaveBeenCalled();
	});

	it("should create a policyId proof", async () => {
		const proof = await RightsManagementProofHelper.createProofPolicyId(
			mockIdentityConnector,
			"did:example:123#key-1",
			"did:example:123",
			"policy-1"
		);
		expect(proof).toHaveProperty("created");
		expect(proof).toHaveProperty(
			"proofValue",
			"zwmwozUs8t63WoiUV7H5Vk9o5ovD2swNNWwWPmFJwKQr99YfwMN7H613VnETbLoboDk4y9ZZi7Z8EpapS3Fkv86p"
		);
		expect(mockIdentityConnector.createProof).toHaveBeenCalled();
	});

	it("should verify a negotiation proof successfully", async () => {
		await expect(
			RightsManagementProofHelper.verifyProofNegotiation(
				mockIdentityConnector,
				{
					assignee: "did:example:123",
					assetType: "assetType",
					action: "read",
					resourceId: "resource-1"
				},
				validNegotiationProof,
				60 * 60 // 1 hour TTL
			)
		).resolves.not.toThrow();
		expect(mockIdentityConnector.verifyProof).toHaveBeenCalled();
	});

	it("should throw if negotiation proof verification fails", async () => {
		const failConnector: IIdentityConnector = {
			...mockIdentityConnector,
			verifyProof: vi.fn(async () => false)
		};
		await expect(
			RightsManagementProofHelper.verifyProofNegotiation(
				failConnector,
				{
					assignee: "did:example:123",
					assetType: "assetType",
					action: "read",
					resourceId: "resource-1"
				},
				validNegotiationProof,
				60 * 60
			)
		).rejects.toThrow("proofNegotiationFailed");
	});

	it("should verify a policyId proof successfully", async () => {
		await expect(
			RightsManagementProofHelper.verifyProofPolicyId(
				mockIdentityConnector,
				"did:example:123",
				"policy-1",
				validPolicyIdProof,
				60 * 60
			)
		).resolves.not.toThrow();
		expect(mockIdentityConnector.verifyProof).toHaveBeenCalled();
	});

	it("should throw if policyId proof verification fails", async () => {
		const failConnector: IIdentityConnector = {
			...mockIdentityConnector,
			verifyProof: vi.fn(async () => false)
		};
		await expect(
			RightsManagementProofHelper.verifyProofPolicyId(
				failConnector,
				"did:example:123",
				"policy-1",
				validNegotiationProof,
				60 * 60
			)
		).rejects.toThrow("proofPolicyIdFailed");
	});

	it("should throw if proof is expired in verifyCreated", async () => {
		await expect(
			RightsManagementProofHelper.verifyCreated(
				expiredProof,
				"did:example:123",
				60 // 1 minute TTL
			)
		).rejects.toThrow("proofExpired");
	});

	it("should throw if proof is missing created date in verifyCreated", async () => {
		const missingCreatedProof: IDataIntegrityProof = {
			type: "DataIntegrityProof",
			cryptosuite: "mock-suite",
			proofPurpose: "assertionMethod",
			// created is missing
			proofValue: "no-date"
		};
		await expect(
			RightsManagementProofHelper.verifyCreated(missingCreatedProof, "did:example:123", 60)
		).rejects.toThrow("proofMissingCreated");
	});
});
