// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Minimal inline JSON-LD context for PAP-managed schema.org policy metadata terms.
 * Avoids importing the full schema.org vocabulary, which collides with ODRL terms such as Offer and target.
 */
export const POLICY_METADATA_CONTEXT = {
	/**
	 * schema.org dateCreated term IRI.
	 */
	dateCreated: "https://schema.org/dateCreated",
	/**
	 * schema.org dateModified term IRI.
	 */
	dateModified: "https://schema.org/dateModified"
} as const;
