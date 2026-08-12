# Interface: IPapQueryRequest

The request structure for querying policies.

## Properties

### query? {#query}

> `optional` **query?**: `object`

The query parameters of the request.

#### type?

> `optional` **type?**: `string`

The type of policy to filter by.

#### assigner?

> `optional` **assigner?**: `string`

The assigner to filter by.

#### assignee?

> `optional` **assignee?**: `string`

The assignee to filter by.

#### action?

> `optional` **action?**: `string`

The action to filter by.

#### target?

> `optional` **target?**: `string`

The target to filter by.

#### conditions?

> `optional` **conditions?**: `string`

The condition for the query.

#### limit?

> `optional` **limit?**: `string`

Limit the number of entities to return.

#### cursor?

> `optional` **cursor?**: `string`

The cursor to get next chunk of data, returned in previous response.

#### properties?

> `optional` **properties?**: `string`

Comma-separated list of policy property names to include in the response.
