// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";

/**
 * The response structure for getting an agreement.
 */
export interface IPapGetAgreementResponse {
	/**
	 * The body of the response.
	 */
	body: IDataspaceProtocolAgreement;
}
