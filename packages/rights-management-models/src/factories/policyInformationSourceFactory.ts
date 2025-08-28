// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyInformationSource } from "../models/IPolicyInformationSource";

/**
 * Factory for creating policy information sources.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyInformationSourceFactory = Factory.createFactory<IPolicyInformationSource>(
	"policy-information",
	true
);
