# Variable: OdrlTwinVocabulary

> `const` **OdrlTwinVocabulary**: `object`

Canonical TWIN constraint vocabulary used in ODRL policies.
Policy authors should reference these constants rather than hand-copying the strings.

## Type Declaration

### JsonPath {#jsonpath}

> `readonly` **JsonPath**: `"twin:jsonPath"` = `"twin:jsonPath"`

The canonical TWIN JSONPath constraint source alias.
Used as the `source` property of an AssetCollection or as a prefix in
composed target identifiers (`twin:jsonPath:<dataSource>:<expression>`).

### JsonPathExpression {#jsonpathexpression}

> `readonly` **JsonPathExpression**: `"twin:jsonPathExpression"` = `"twin:jsonPathExpression"`

Constraint / context property carrying the JSONPath expression to evaluate.

### JsonPathDataSource {#jsonpathdatasource}

> `readonly` **JsonPathDataSource**: `"twin:jsonPathDataSource"` = `"twin:jsonPathDataSource"`

Optional constraint / context property that selects the named data source.
When absent, defaults to "data".

### DataSourceKey {#datasourcekey}

> `readonly` **DataSourceKey**: `"data"` = `"data"`

Key used to look up the primary data payload inside the data-sources map
passed to the policy arbiter.

### InformationSourceKey {#informationsourcekey}

> `readonly` **InformationSourceKey**: `"information"` = `"information"`

Key used to look up the information payload inside the data-sources map
passed to the policy arbiter.
