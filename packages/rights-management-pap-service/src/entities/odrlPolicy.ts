// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { OdrlPolicyType } from "@twin.org/standards-w3c-odrl";

/**
 * Class describing an ODRL policy for entity storage.
 */
@entity()
export class OdrlPolicy {
	/**
	 * The unique identifier for the policy.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The type of policy.
	 */
	@property({ type: "string", isSecondary: true })
	public type!: OdrlPolicyType;

	/**
	 * The profile(s) this policy conforms to.
	 */
	@property({ type: "object", optional: true })
	public profile?: IDataspaceProtocolPolicy["profile"];

	/**
	 * The assigner of the policy.
	 */
	@property({ type: "object", optional: true })
	public assigner?: IDataspaceProtocolPolicy["assigner"];

	/**
	 * The assignee of the policy.
	 */
	@property({ type: "object", optional: true })
	public assignee?: IDataspaceProtocolPolicy["assignee"];

	/**
	 * The target asset for the rule.
	 */
	@property({ type: "object", optional: true })
	public target?: IDataspaceProtocolPolicy["target"];

	/**
	 * The action associated with the rule.
	 */
	@property({ type: "object", optional: true })
	public action?: IDataspaceProtocolPolicy["action"];

	/**
	 * The parent policy(ies) this policy inherits from.
	 */
	@property({ type: "object", optional: true })
	public inheritFrom?: IDataspaceProtocolPolicy["inheritFrom"];

	/**
	 * The conflict resolution strategy.
	 */
	@property({ type: "string", optional: true })
	public conflict?: IDataspaceProtocolPolicy["conflict"];

	/**
	 * The permissions in the policy.
	 */
	@property({ type: "object", optional: true })
	public permission?: IDataspaceProtocolPolicy["permission"];

	/**
	 * The prohibitions in the policy.
	 */
	@property({ type: "array", optional: true })
	public prohibition?: IDataspaceProtocolPolicy["prohibition"];

	/**
	 * The obligations in the policy.
	 */
	@property({ type: "array", optional: true })
	public obligation?: IDataspaceProtocolPolicy["obligation"];

	/**
	 * The assignerIndex.
	 */
	@property({ type: "string" })
	public assignerIndex!: string;

	/**
	 * The assigneeIndex.
	 */
	@property({ type: "string" })
	public assigneeIndex!: string;

	/**
	 * The targetIndex.
	 */
	@property({ type: "string" })
	public targetIndex!: string;

	/**
	 * The actionIndex.
	 */
	@property({ type: "string" })
	public actionIndex!: string;
}
