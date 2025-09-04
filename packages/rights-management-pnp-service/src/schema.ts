// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { PolicyNegotiation } from "./entities/policyNegotiation";

/**
 * Initialize the schema for the rights management policy negotiation point.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<PolicyNegotiation>(), () =>
		EntitySchemaHelper.getSchema(PolicyNegotiation)
	);
}
