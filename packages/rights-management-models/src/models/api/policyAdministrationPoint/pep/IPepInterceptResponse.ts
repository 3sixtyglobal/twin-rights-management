// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The response structure for intercepting a request and enforcing a policy.
 */
export interface IPepInterceptResponse {
	/**
	 * The manipulated data with any policies applied.
	 */
	body: unknown;
}
