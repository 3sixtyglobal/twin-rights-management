// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyRequester } from "../models/pnp/IPolicyRequester.js";

/**
 * Factory for managing policy requester registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyRequesterFactory = Factory.createFactory<IPolicyRequester>("policy-requester");
