// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyExecutionAction } from "../models/IPolicyExecutionAction";

/**
 * Factory for creating data converter connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyExecutionActionFactory = Factory.createFactory<IPolicyExecutionAction>(
	"policy-execution",
	true
);
