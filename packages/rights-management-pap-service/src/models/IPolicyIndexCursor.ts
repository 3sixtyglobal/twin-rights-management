// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The decoded form of the cursor returned by a locator query. Callers must treat the cursor as an
 * opaque string, this shape is an implementation detail of how the paging state is encoded.
 */
export interface IPolicyIndexCursor {
	/**
	 * The version of the encoded cursor, which identifies it as belonging to a locator query so a
	 * cursor from a query with a different shape is rejected instead of being misread.
	 */
	v: number;

	/**
	 * The cursor for the index storage, which is what pages a locator query.
	 */
	ic: string;

	/**
	 * The policy already returned by the previous page whose remaining index entries begin the next
	 * one, so it is skipped rather than returned twice. The index is ordered by policy id within a
	 * creation date, so only the last policy of a page can straddle the boundary and at most one id
	 * ever needs carrying.
	 */
	sp?: string;
}
