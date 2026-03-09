# Rights Management Packages

## rights-management-models

The package defines shared models for rights management policies, offers, agreements, negotiation artefacts, and connector contracts used across the repository. It provides a single semantic baseline so service packages can exchange structured data without custom translation layers. It aligns with policy semantics described by [ODRL](https://www.w3.org/TR/odrl-model/) and interoperable negotiation practices used in dataspace environments.

- [README](../packages/rights-management-models/README.md)
- [Examples](../packages/rights-management-models/docs/examples.md)
- [Changelog](../packages/rights-management-models/docs/changelog.md)

## rights-management-pap-service

This package implements the policy administration point and focuses on policy persistence, retrieval, and lifecycle updates. It acts as the authoritative management layer for policy entities so other components can rely on consistent and queryable policy state throughout evaluation and negotiation flows.

- [README](../packages/rights-management-pap-service/README.md)
- [Examples](../packages/rights-management-pap-service/docs/examples.md)
- [Changelog](../packages/rights-management-pap-service/docs/changelog.md)

## rights-management-pmp-service

This package implements the policy management point and is responsible for resolving policy candidates that match request locators and filtering criteria. It helps evaluation components work with deterministic policy sets and supports predictable policy selection behaviour in larger deployments.

- [README](../packages/rights-management-pmp-service/README.md)
- [Examples](../packages/rights-management-pmp-service/docs/examples.md)
- [Changelog](../packages/rights-management-pmp-service/docs/changelog.md)

## rights-management-pip-service

This package implements the policy information point and supplies contextual facts needed during policy decisions and negotiations. It provides an extensible mechanism for sourcing environment and domain data so decision-making can be grounded in current runtime conditions.

- [README](../packages/rights-management-pip-service/README.md)
- [Examples](../packages/rights-management-pip-service/docs/examples.md)
- [Changelog](../packages/rights-management-pip-service/docs/changelog.md)

## rights-management-pxp-service

This package implements the policy execution point action pipeline used around policy decisions. It enables pre and post evaluation processing so deployments can add cross-cutting behaviours, enrichment steps, and execution hooks without changing core decision logic.

- [README](../packages/rights-management-pxp-service/README.md)
- [Examples](../packages/rights-management-pxp-service/docs/examples.md)
- [Changelog](../packages/rights-management-pxp-service/docs/changelog.md)

## rights-management-pdp-service

This package implements the policy decision point and produces authorisation outcomes from policies, contextual information, and request data. It coordinates candidate policy retrieval and arbitration to deliver consistent permit and deny decisions suitable for downstream enforcement.

- [README](../packages/rights-management-pdp-service/README.md)
- [Examples](../packages/rights-management-pdp-service/docs/examples.md)
- [Changelog](../packages/rights-management-pdp-service/docs/changelog.md)

## rights-management-pep-service

This package implements the policy enforcement point that applies policy decisions to runtime data and operations. It translates decision outputs into practical enforcement behaviour so access control and obligation handling remain consistent at integration boundaries.

- [README](../packages/rights-management-pep-service/README.md)
- [Examples](../packages/rights-management-pep-service/docs/examples.md)
- [Changelog](../packages/rights-management-pep-service/docs/changelog.md)

## rights-management-pnp-service

This package implements the policy negotiation point and supports contract negotiation workflows between participating nodes. It is aligned with the [IDS Contract Negotiation protocol](https://docs.internationaldataspaces.org/ids-knowledgebase/dataspace-protocol/contract-negotiation/contract.negotiation.protocol), enabling interoperable agreement creation and lifecycle handling.

- [README](../packages/rights-management-pnp-service/README.md)
- [Examples](../packages/rights-management-pnp-service/docs/examples.md)
- [Changelog](../packages/rights-management-pnp-service/docs/changelog.md)

## rights-management-service

This package provides a unified service layer that exposes rights management operations through a coherent interface. It is intended for deployments that need consolidated policy and negotiation capabilities without composing every component individually.

- [README](../packages/rights-management-service/README.md)
- [Examples](../packages/rights-management-service/docs/examples.md)
- [Changelog](../packages/rights-management-service/docs/changelog.md)

## rights-management-rest-client

This package provides a REST client for integrating remote rights management services into applications and workflows. It simplifies communication with distributed deployments and offers a practical entry point for systems that consume policy services over HTTP.

- [README](../packages/rights-management-rest-client/README.md)
- [Examples](../packages/rights-management-rest-client/docs/examples.md)
- [Changelog](../packages/rights-management-rest-client/docs/changelog.md)

## rights-management-plugins

This package contains plugin implementations used to extend rights management components with deployment-specific behaviour. It supports modular customisation so teams can adapt policy processing without forking core services.

- [README](../packages/rights-management-plugins/README.md)
- [Examples](../packages/rights-management-plugins/docs/examples.md)
- [Changelog](../packages/rights-management-plugins/docs/changelog.md)
