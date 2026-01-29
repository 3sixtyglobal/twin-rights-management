// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlAgreement } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for getting an agreement.
 */
export interface IPapGetAgreementResponse {
	/**
	 * The body of the response.
	 */
	body: IOdrlAgreement;
}
