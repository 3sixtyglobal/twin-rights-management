// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPnapCreateBody } from "./IPnapCreateBody.js";

/**
 * The request structure for creating a policy negotiation entry.
 */
export interface IPnapCreateRequest {
	/**
	 * The partial negotiation to pre-register.
	 */
	body: IPnapCreateBody;
}
