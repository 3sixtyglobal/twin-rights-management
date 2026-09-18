# Class: OdrlPolicyIndex

Class describing an ODRL policy index entry used for query filtering. One entry is stored for
each combination of assigner, assignee, target and action a policy carries, so a locator which
filters on several of those fields is answered by a single lookup on the composite index instead
of one lookup per field.

The lengths of the indexed columns are deliberately modest because they all belong to the same
composite index, and a composite index key has a size limit on some databases.

## Constructors

### Constructor

> **new OdrlPolicyIndex**(): `OdrlPolicyIndex`

#### Returns

`OdrlPolicyIndex`

## Properties

### id {#id}

> **id**: `string`

The id of the index entry.

***

### policyId {#policyid}

> **policyId**: `string`

The id of the policy this index entry refers to. It is the last key of the composite index so
the entries of one policy are read contiguously, which means only the last policy of a page
can carry over into the next one.

***

### assigner? {#assigner}

> `optional` **assigner?**: `string`

An assigner party id of the policy, case folded so lookups do not depend on the column
collation. Absent when the policy has no assigner.

***

### assignee? {#assignee}

> `optional` **assignee?**: `string`

An assignee party id of the policy, case folded so lookups do not depend on the column
collation. Absent when the policy has no assignee.

***

### target? {#target}

> `optional` **target?**: `string`

A target asset id of the policy, case folded so lookups do not depend on the column
collation. Absent when the policy has no target.

***

### action? {#action}

> `optional` **action?**: `string`

An action identifier of the policy, case folded so lookups do not depend on the column
collation. Absent when the policy has no action.

***

### dateCreated {#datecreated}

> **dateCreated**: `string`

The date/time of when the policy was created, copied so the index can order and page its own
matches without reading the policies.
