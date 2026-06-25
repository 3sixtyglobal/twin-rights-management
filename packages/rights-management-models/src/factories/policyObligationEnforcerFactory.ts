// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyObligationEnforcer } from "../models/pdp/IPolicyObligationEnforcer.js";

/**
 * Factory for managing policy obligation enforcer registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyObligationEnforcerFactory = Factory.createFactory<IPolicyObligationEnforcer>(
	"policy-obligation-enforcer"
);
