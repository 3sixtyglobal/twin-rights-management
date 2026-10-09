// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { IPolicyExecutionAction } from "../models/pxp/IPolicyExecutionAction.js";

/**
 * Factory for managing policy execution action registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyExecutionActionFactory =
	Factory.createFactory<IPolicyExecutionAction>("policy-execution-action");
