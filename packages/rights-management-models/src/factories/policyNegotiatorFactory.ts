// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { IPolicyNegotiator } from "../models/pnp/IPolicyNegotiator.js";

/**
 * Factory for managing policy negotiators registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyNegotiatorFactory =
	Factory.createFactory<IPolicyNegotiator>("policy-negotiator");
