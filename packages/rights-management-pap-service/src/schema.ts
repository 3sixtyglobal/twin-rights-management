// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { nameof } from "@3sixty/nameof";
import { OdrlPolicy } from "./entities/odrlPolicy.js";
import { OdrlPolicyIndex } from "./entities/odrlPolicyIndex.js";
import { OdrlPolicyV0 } from "./entities/odrlPolicyV0.js";

/**
 * Initialize the schema for the rights management policy administration point.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<OdrlPolicy>(), () =>
		EntitySchemaHelper.getSchema(OdrlPolicy)
	);
	EntitySchemaFactory.register(nameof<OdrlPolicyV0>(), () =>
		EntitySchemaHelper.getSchema(OdrlPolicyV0)
	);
	EntitySchemaFactory.register(nameof<OdrlPolicyIndex>(), () =>
		EntitySchemaHelper.getSchema(OdrlPolicyIndex)
	);
}
