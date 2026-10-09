// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { nameof } from "@3sixty/nameof";
import { PolicyNegotiation } from "./entities/policyNegotiation.js";

/**
 * Initialize the schema for the rights management policy negotiation point.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<PolicyNegotiation>(), () =>
		EntitySchemaHelper.getSchema(PolicyNegotiation)
	);
}
