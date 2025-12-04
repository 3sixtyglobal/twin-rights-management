// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IDataAccessHandler } from "../models/dap/IDataAccessHandler.js";

/**
 * Factory for managing data access handlers registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DataAccessHandlerFactory =
	Factory.createFactory<IDataAccessHandler>("data-access-handler");
