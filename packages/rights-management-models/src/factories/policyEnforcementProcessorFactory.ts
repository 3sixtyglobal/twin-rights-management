// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyEnforcementProcessor } from "../models/IPolicyEnforcementProcessor";

/**
 * Factory for creating policy enforcement processors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyEnforcementProcessorFactory = Factory.createFactory<IPolicyEnforcementProcessor>(
	"policy-enforcement",
	true
);
