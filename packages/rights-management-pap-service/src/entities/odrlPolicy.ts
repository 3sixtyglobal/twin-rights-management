// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";
import type { IOdrlPolicy, PolicyType } from "@twin.org/standards-w3c-odrl";

/**
 * Class describing an ODRL policy for entity storage.
 */
@entity()
export class OdrlPolicy {
	/**
	 * The unique identifier for the policy.
	 */
	@property({ type: "string", isPrimary: true })
	public uid!: string;

	/**
	 * The type of policy.
	 */
	@property({ type: "string" })
	public "@type"!: PolicyType;

	/**
	 * The profile(s) this policy conforms to.
	 */
	@property({ type: "object", optional: true })
	public profile?: IOdrlPolicy["profile"];

	/**
	 * The assigner of the policy.
	 */
	@property({ type: "object", optional: true })
	public assigner?: IOdrlPolicy["assigner"];

	/**
	 * The assignee of the policy.
	 */
	@property({ type: "object", optional: true })
	public assignee?: IOdrlPolicy["assignee"];

	/**
	 * The target asset for the rule.
	 */
	@property({ type: "object", optional: true })
	public target?: IOdrlPolicy["target"];

	/**
	 * The action associated with the rule.
	 */
	@property({ type: "object", optional: true })
	public action?: IOdrlPolicy["action"];

	/**
	 * The parent policy(ies) this policy inherits from.
	 */
	@property({ type: "object", optional: true })
	public inheritFrom?: IOdrlPolicy["inheritFrom"];

	/**
	 * The conflict resolution strategy.
	 */
	@property({ type: "string", optional: true })
	public conflict?: IOdrlPolicy["conflict"];

	/**
	 * The permissions in the policy.
	 */
	@property({ type: "object", optional: true })
	public permission?: IOdrlPolicy["permission"];

	/**
	 * The prohibitions in the policy.
	 */
	@property({ type: "array", optional: true })
	public prohibition?: IOdrlPolicy["prohibition"];

	/**
	 * The obligations in the policy.
	 */
	@property({ type: "array", optional: true })
	public obligation?: IOdrlPolicy["obligation"];
}
