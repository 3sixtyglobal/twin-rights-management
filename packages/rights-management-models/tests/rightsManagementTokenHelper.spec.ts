// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	initSchema as initSchemaIdentity,
	type IdentityDocument
} from "@twin.org/identity-connector-entity-storage";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import type { IPolicyNegotiationRequest } from "../src/models/pnp/jsonLd/IPolicyNegotiationRequest";
import type { IPolicyRequest } from "../src/models/pnp/jsonLd/IPolicyRequest";
import { RightsManagementContexts } from "../src/models/rightsManagementContexts";
import { RightsManagementTypes } from "../src/models/rightsManagementTypes";
import { RightsManagementTokenHelper } from "../src/utils/rightsManagementTokenHelper";

const MOCK_TIME = 1724327816272;
let identityConnector: IIdentityConnector;
let testIdentity: string;

describe("RightsManagementTokenHelper", () => {
	beforeAll(async () => {
		initSchemaIdentity();
		initSchemaVault();

		Date.now = vi.fn().mockImplementation(() => MOCK_TIME);

		EntityStorageConnectorFactory.register(
			"vault-key",
			() =>
				new MemoryEntityStorageConnector<VaultKey>({
					entitySchema: nameof<VaultKey>()
				})
		);
		const secretEntityStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>()
		});
		EntityStorageConnectorFactory.register("vault-secret", () => secretEntityStorage);

		const vaultConnector = new EntityStorageVaultConnector();
		VaultConnectorFactory.register("vault", () => vaultConnector);

		const identityDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>()
		});
		EntityStorageConnectorFactory.register(
			"identity-document",
			() => identityDocumentEntityStorage
		);

		identityConnector = new EntityStorageIdentityConnector();
		IdentityConnectorFactory.register("identity", () => identityConnector);

		const doc = await identityConnector.createDocument("test-controller");
		testIdentity = doc.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			doc.id,
			"verificationMethod",
			"key-1"
		);
	});

	it("should create and verify negotiation proof", async () => {
		const policyNegotiationRequest: IPolicyNegotiationRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assignee: testIdentity,
			assetType: "assetType",
			action: "read",
			resourceId: "resource-1"
		};
		const proof = await RightsManagementTokenHelper.createToken(
			identityConnector,
			`${testIdentity}#key-1`,
			policyNegotiationRequest,
			60
		);
		expect(proof.split(".").length).toEqual(3);

		const vc = await RightsManagementTokenHelper.verifyToken(
			identityConnector,
			policyNegotiationRequest,
			proof,
			60 * 60
		);
		expect(vc?.issuer).toEqual(testIdentity);
	});

	it("should create and verify policy id", async () => {
		const policyRequest: IPolicyRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyRequest,
			id: "policy-1"
		};
		const proof = await RightsManagementTokenHelper.createToken(
			identityConnector,
			`${testIdentity}#key-1`,
			policyRequest,
			60
		);
		expect(proof.split(".").length).toEqual(3);

		const vc = await RightsManagementTokenHelper.verifyToken(
			identityConnector,
			policyRequest,
			proof,
			60 * 60
		);
		expect(vc?.issuer).toEqual(testIdentity);
	});

	it("should fail verification for expired proof", async () => {
		const policyNegotiationRequest: IPolicyNegotiationRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assignee: testIdentity,
			assetType: "assetType",
			action: "read",
			resourceId: "resource-1"
		};
		const proof = await RightsManagementTokenHelper.createToken(
			identityConnector,
			`${testIdentity}#key-1`,
			policyNegotiationRequest,
			60
		);

		await expect(
			RightsManagementTokenHelper.verifyToken(
				identityConnector,
				policyNegotiationRequest,
				proof,
				-1
			)
		).rejects.toMatchObject({
			message: "rightsManagementTokenHelper.tokenFailed",
			cause: { message: "rightsManagementTokenHelper.tokenExpired" }
		});
	});
});
