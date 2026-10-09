# 3Sixty Rights Management

This repository provides a modular rights management stack for policy lifecycle management, policy evaluation, policy enforcement, and policy negotiation across interoperable data-sharing environments. The packages are designed to be composed, so teams can adopt a complete end-to-end service or integrate individual components into existing platform workflows.

Together, these packages establish a consistent policy model, predictable decision behaviour, and extensibility points for deployment-specific logic. The result is a practical foundation for building secure and auditable authorisation capabilities in distributed systems.

## Packages

- [rights-management-models](packages/rights-management-models/README.md) - Data model definitions for rights management policies, negotiations, and service contracts.
- [rights-management-pap-service](packages/rights-management-pap-service/README.md) - Policy administration point service for storing and managing policy records.
- [rights-management-pmp-service](packages/rights-management-pmp-service/README.md) - Policy management point service for locating and preparing candidate policies.
- [rights-management-pip-service](packages/rights-management-pip-service/README.md) - Policy information point service for supplying context facts to evaluations.
- [rights-management-pxp-service](packages/rights-management-pxp-service/README.md) - Policy execution point service for pre and post evaluation action pipelines.
- [rights-management-pdp-service](packages/rights-management-pdp-service/README.md) - Policy decision point service for producing authorisation decisions from policies and context.
- [rights-management-pep-service](packages/rights-management-pep-service/README.md) - Policy enforcement point service for applying decisions to protected data flows.
- [rights-management-pnp-service](packages/rights-management-pnp-service/README.md) - Policy negotiation point service for running contract negotiation workflows and outcomes.
- [rights-management-service](packages/rights-management-service/README.md) - Unified rights management service exposing policy and negotiation capabilities.
- [rights-management-rest-client](packages/rights-management-rest-client/README.md) - REST client for integrating rights management workflows with remote endpoints.
- [rights-management-plugins](packages/rights-management-plugins/README.md) - Plugin implementations for extending rights management behaviour across components.

## Architecture

- [Rights Management Components](docs/architecture/components.md) - Component architecture, responsibility boundaries, and lifecycle flows for policy and negotiation services.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)

## Origin

This repository is derived from the original [iotaledger/twin-rights-management](https://github.com/iotaledger/twin-rights-management) repository.
