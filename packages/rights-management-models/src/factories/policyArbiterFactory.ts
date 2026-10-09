// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { IPolicyArbiter } from "../models/pdp/IPolicyArbiter.js";

/**
 * Factory for managing policy arbiters registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyArbiterFactory = Factory.createFactory<IPolicyArbiter>("policy-arbiter");
