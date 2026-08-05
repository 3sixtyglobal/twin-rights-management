# Changelog

## Unreleased

### ⚠ BREAKING CHANGES

* remove EcosystemPolicy-related examples/assumptions; plugins now target standard ODRL policy types for v2.

## [0.9.2-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.2-next.1...rights-management-plugins-v0.9.2-next.2) (2026-08-04)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.1 to 0.9.2-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.1 to 0.9.2-next.2

## [0.9.2-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.2-next.0...rights-management-plugins-v0.9.2-next.1) (2026-07-30)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* identity profile information source ([#194](https://github.com/iotaledger/twin-rights-management/issues/194)) ([c17bd14](https://github.com/iotaledger/twin-rights-management/commit/c17bd14387ab3945cac6f1d0ba2a8adb57d2302b))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* left operators ([#203](https://github.com/iotaledger/twin-rights-management/issues/203)) ([93dced6](https://github.com/iotaledger/twin-rights-management/commit/93dced6186097794ef5f3620bcf8cc86c0a77f9d))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* maintain structural keys ([#235](https://github.com/iotaledger/twin-rights-management/issues/235)) ([c140bfe](https://github.com/iotaledger/twin-rights-management/commit/c140bfed9b652caf64e8de032b2f3c3535e7d1b3))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* support assignee/assigner PartyCollection refinements in policy arbiter ([#241](https://github.com/iotaledger/twin-rights-management/issues/241)) ([a2af306](https://github.com/iotaledger/twin-rights-management/commit/a2af306928e877ce0995ff6e0885cc31aa625e6d))
* support direct REQUESTED -&gt; AGREED contract negotiation shortcut ([#239](https://github.com/iotaledger/twin-rights-management/issues/239)) ([99aff32](https://github.com/iotaledger/twin-rights-management/commit/99aff32f867d097f8567bf61ed36996d194e3c0b))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* vocab constants ([#265](https://github.com/iotaledger/twin-rights-management/issues/265)) ([fa1ff8a](https://github.com/iotaledger/twin-rights-management/commit/fa1ff8a0a557b83162cc961b867c443978d52f45))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* date time coercion ([#256](https://github.com/iotaledger/twin-rights-management/issues/256)) ([96729c2](https://github.com/iotaledger/twin-rights-management/commit/96729c21af84e7f9f06349e1eeb2f859e29f5cd2))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* negotiator direct agreement default ([#258](https://github.com/iotaledger/twin-rights-management/issues/258)) ([5859235](https://github.com/iotaledger/twin-rights-management/commit/58592353c1572b5506439b6f2763dc3bb7c8646b))
* repair legacy constraint/context forms in use-cases ([#244](https://github.com/iotaledger/twin-rights-management/issues/244)) ([2042de4](https://github.com/iotaledger/twin-rights-management/commit/2042de4f17e4048d91d4789e6ad95795fae1c7ea))
* resolve rule targets equal to the policy asset target as the whole payload ([#261](https://github.com/iotaledger/twin-rights-management/issues/261)) ([f6ae84f](https://github.com/iotaledger/twin-rights-management/commit/f6ae84f911280d3376b114029e538eb87cc96503))
* support source-less, refinement-scoped AssetCollection targets in DefaultPolicyArbiter ([#264](https://github.com/iotaledger/twin-rights-management/issues/264)) ([625ede0](https://github.com/iotaledger/twin-rights-management/commit/625ede05a07833717e20a17290efdaca7b72e249))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))
* use real ODRL action terms and correct UC5's duty narrative to match the policy ([#253](https://github.com/iotaledger/twin-rights-management/issues/253)) ([81c460d](https://github.com/iotaledger/twin-rights-management/commit/81c460d3f16b52d7f7e09ffb156548f95f390a28))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.0 to 0.9.2-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.0 to 0.9.2-next.1

## [0.9.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1...rights-management-plugins-v0.9.1) (2026-07-27)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))
* release to production ([#275](https://github.com/iotaledger/twin-rights-management/issues/275)) ([a5dc94e](https://github.com/iotaledger/twin-rights-management/commit/a5dc94e7f207fce4c4806d8e8e124eeb180e7b15))

## [0.9.1-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.13...rights-management-plugins-v0.9.1-next.14) (2026-07-22)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.13 to 0.9.1-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.13 to 0.9.1-next.14

## [0.9.1-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.12...rights-management-plugins-v0.9.1-next.13) (2026-07-21)


### Bug Fixes

* support source-less, refinement-scoped AssetCollection targets in DefaultPolicyArbiter ([#264](https://github.com/iotaledger/twin-rights-management/issues/264)) ([625ede0](https://github.com/iotaledger/twin-rights-management/commit/625ede05a07833717e20a17290efdaca7b72e249))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.12 to 0.9.1-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.12 to 0.9.1-next.13

## [0.9.1-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.11...rights-management-plugins-v0.9.1-next.12) (2026-07-21)


### Features

* vocab constants ([#265](https://github.com/iotaledger/twin-rights-management/issues/265)) ([fa1ff8a](https://github.com/iotaledger/twin-rights-management/commit/fa1ff8a0a557b83162cc961b867c443978d52f45))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.11 to 0.9.1-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.11 to 0.9.1-next.12

## [0.9.1-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.10...rights-management-plugins-v0.9.1-next.11) (2026-07-20)


### Bug Fixes

* resolve rule targets equal to the policy asset target as the whole payload ([#261](https://github.com/iotaledger/twin-rights-management/issues/261)) ([f6ae84f](https://github.com/iotaledger/twin-rights-management/commit/f6ae84f911280d3376b114029e538eb87cc96503))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.10 to 0.9.1-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.10 to 0.9.1-next.11

## [0.9.1-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.9...rights-management-plugins-v0.9.1-next.10) (2026-07-20)


### Bug Fixes

* negotiator direct agreement default ([#258](https://github.com/iotaledger/twin-rights-management/issues/258)) ([5859235](https://github.com/iotaledger/twin-rights-management/commit/58592353c1572b5506439b6f2763dc3bb7c8646b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.9 to 0.9.1-next.10
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.9 to 0.9.1-next.10

## [0.9.1-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.8...rights-management-plugins-v0.9.1-next.9) (2026-07-20)


### Bug Fixes

* date time coercion ([#256](https://github.com/iotaledger/twin-rights-management/issues/256)) ([96729c2](https://github.com/iotaledger/twin-rights-management/commit/96729c21af84e7f9f06349e1eeb2f859e29f5cd2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.8 to 0.9.1-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.8 to 0.9.1-next.9

## [0.9.1-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.7...rights-management-plugins-v0.9.1-next.8) (2026-07-17)


### Bug Fixes

* use real ODRL action terms and correct UC5's duty narrative to match the policy ([#253](https://github.com/iotaledger/twin-rights-management/issues/253)) ([81c460d](https://github.com/iotaledger/twin-rights-management/commit/81c460d3f16b52d7f7e09ffb156548f95f390a28))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.7 to 0.9.1-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.7 to 0.9.1-next.8

## [0.9.1-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.6...rights-management-plugins-v0.9.1-next.7) (2026-07-16)


### Bug Fixes

* repair legacy constraint/context forms in use-cases ([#244](https://github.com/iotaledger/twin-rights-management/issues/244)) ([2042de4](https://github.com/iotaledger/twin-rights-management/commit/2042de4f17e4048d91d4789e6ad95795fae1c7ea))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.6 to 0.9.1-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.6 to 0.9.1-next.7

## [0.9.1-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.5...rights-management-plugins-v0.9.1-next.6) (2026-07-15)


### Features

* support assignee/assigner PartyCollection refinements in policy arbiter ([#241](https://github.com/iotaledger/twin-rights-management/issues/241)) ([a2af306](https://github.com/iotaledger/twin-rights-management/commit/a2af306928e877ce0995ff6e0885cc31aa625e6d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.5 to 0.9.1-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.5 to 0.9.1-next.6

## [0.9.1-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.4...rights-management-plugins-v0.9.1-next.5) (2026-07-14)


### Features

* support direct REQUESTED -&gt; AGREED contract negotiation shortcut ([#239](https://github.com/iotaledger/twin-rights-management/issues/239)) ([99aff32](https://github.com/iotaledger/twin-rights-management/commit/99aff32f867d097f8567bf61ed36996d194e3c0b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.4 to 0.9.1-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.4 to 0.9.1-next.5

## [0.9.1-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.3...rights-management-plugins-v0.9.1-next.4) (2026-07-02)


### Features

* maintain structural keys ([#235](https://github.com/iotaledger/twin-rights-management/issues/235)) ([c140bfe](https://github.com/iotaledger/twin-rights-management/commit/c140bfed9b652caf64e8de032b2f3c3535e7d1b3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.3 to 0.9.1-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.3 to 0.9.1-next.4

## [0.9.1-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.2...rights-management-plugins-v0.9.1-next.3) (2026-06-30)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.2 to 0.9.1-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.1...rights-management-plugins-v0.9.1-next.2) (2026-06-29)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.1 to 0.9.1-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.1-next.0...rights-management-plugins-v0.9.1-next.1) (2026-06-26)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* identity profile information source ([#194](https://github.com/iotaledger/twin-rights-management/issues/194)) ([c17bd14](https://github.com/iotaledger/twin-rights-management/commit/c17bd14387ab3945cac6f1d0ba2a8adb57d2302b))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* left operators ([#203](https://github.com/iotaledger/twin-rights-management/issues/203)) ([93dced6](https://github.com/iotaledger/twin-rights-management/commit/93dced6186097794ef5f3620bcf8cc86c0a77f9d))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.0 to 0.9.1-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pdp-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pep-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pmp-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pnp-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pxp-service bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.0...rights-management-plugins-v0.9.0) (2026-06-25)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))

## [0.9.0-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.9.0-next.0...rights-management-plugins-v0.9.0-next.1) (2026-06-23)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* identity profile information source ([#194](https://github.com/iotaledger/twin-rights-management/issues/194)) ([c17bd14](https://github.com/iotaledger/twin-rights-management/commit/c17bd14387ab3945cac6f1d0ba2a8adb57d2302b))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* left operators ([#203](https://github.com/iotaledger/twin-rights-management/issues/203)) ([93dced6](https://github.com/iotaledger/twin-rights-management/commit/93dced6186097794ef5f3620bcf8cc86c0a77f9d))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.0-next.0 to 0.9.0-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pdp-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pep-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pmp-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pnp-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pxp-service bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.58](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.57...rights-management-plugins-v0.0.3-next.58) (2026-06-19)


### Features

* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.57 to 0.0.3-next.58
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.57 to 0.0.3-next.58

## [0.0.3-next.57](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.56...rights-management-plugins-v0.0.3-next.57) (2026-06-19)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.56 to 0.0.3-next.57
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.56 to 0.0.3-next.57

## [0.0.3-next.56](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.55...rights-management-plugins-v0.0.3-next.56) (2026-06-19)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.55 to 0.0.3-next.56
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.55 to 0.0.3-next.56

## [0.0.3-next.55](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.54...rights-management-plugins-v0.0.3-next.55) (2026-06-18)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.54 to 0.0.3-next.55
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.54 to 0.0.3-next.55

## [0.0.3-next.54](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.53...rights-management-plugins-v0.0.3-next.54) (2026-06-18)


### Features

* left operators ([#203](https://github.com/iotaledger/twin-rights-management/issues/203)) ([93dced6](https://github.com/iotaledger/twin-rights-management/commit/93dced6186097794ef5f3620bcf8cc86c0a77f9d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.53 to 0.0.3-next.54
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.53 to 0.0.3-next.54

## [0.0.3-next.53](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.52...rights-management-plugins-v0.0.3-next.53) (2026-06-17)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.52 to 0.0.3-next.53
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.52 to 0.0.3-next.53

## [0.0.3-next.52](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.51...rights-management-plugins-v0.0.3-next.52) (2026-06-17)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.51 to 0.0.3-next.52
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.51 to 0.0.3-next.52

## [0.0.3-next.51](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.50...rights-management-plugins-v0.0.3-next.51) (2026-06-16)


### Features

* identity profile information source ([#194](https://github.com/iotaledger/twin-rights-management/issues/194)) ([c17bd14](https://github.com/iotaledger/twin-rights-management/commit/c17bd14387ab3945cac6f1d0ba2a8adb57d2302b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.50 to 0.0.3-next.51
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.50 to 0.0.3-next.51

## [0.0.3-next.50](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.49...rights-management-plugins-v0.0.3-next.50) (2026-06-15)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.49 to 0.0.3-next.50
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.49 to 0.0.3-next.50

## [0.0.3-next.49](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.48...rights-management-plugins-v0.0.3-next.49) (2026-06-15)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.48 to 0.0.3-next.49
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.48 to 0.0.3-next.49

## [0.0.3-next.48](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.47...rights-management-plugins-v0.0.3-next.48) (2026-06-15)


### Bug Fixes

* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.47 to 0.0.3-next.48
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.47 to 0.0.3-next.48

## [0.0.3-next.47](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.46...rights-management-plugins-v0.0.3-next.47) (2026-06-12)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.46 to 0.0.3-next.47
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.46 to 0.0.3-next.47

## [0.0.3-next.46](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.45...rights-management-plugins-v0.0.3-next.46) (2026-06-11)


### Features

* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.45 to 0.0.3-next.46
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.45 to 0.0.3-next.46

## [0.0.3-next.45](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.44...rights-management-plugins-v0.0.3-next.45) (2026-06-05)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.44 to 0.0.3-next.45
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.44 to 0.0.3-next.45

## [0.0.3-next.44](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.43...rights-management-plugins-v0.0.3-next.44) (2026-06-05)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.43 to 0.0.3-next.44
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.43 to 0.0.3-next.44

## [0.0.3-next.43](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.42...rights-management-plugins-v0.0.3-next.43) (2026-06-04)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.42 to 0.0.3-next.43
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.42 to 0.0.3-next.43

## [0.0.3-next.42](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.41...rights-management-plugins-v0.0.3-next.42) (2026-06-04)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.41 to 0.0.3-next.42
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.41 to 0.0.3-next.42

## [0.0.3-next.41](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.40...rights-management-plugins-v0.0.3-next.41) (2026-06-03)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.40 to 0.0.3-next.41
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.40 to 0.0.3-next.41

## [0.0.3-next.40](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.39...rights-management-plugins-v0.0.3-next.40) (2026-06-03)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.39 to 0.0.3-next.40
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.39 to 0.0.3-next.40

## [0.0.3-next.39](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.38...rights-management-plugins-v0.0.3-next.39) (2026-06-02)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.38 to 0.0.3-next.39
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.38 to 0.0.3-next.39

## [0.0.3-next.38](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.37...rights-management-plugins-v0.0.3-next.38) (2026-06-02)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.37 to 0.0.3-next.38
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.37 to 0.0.3-next.38

## [0.0.3-next.37](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.36...rights-management-plugins-v0.0.3-next.37) (2026-05-26)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.36 to 0.0.3-next.37
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.36 to 0.0.3-next.37

## [0.0.3-next.36](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.35...rights-management-plugins-v0.0.3-next.36) (2026-05-20)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.35 to 0.0.3-next.36
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.35 to 0.0.3-next.36

## [0.0.3-next.35](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.34...rights-management-plugins-v0.0.3-next.35) (2026-05-20)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))
* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Bug Fixes

* array check for undefined ([df6a6aa](https://github.com/iotaledger/twin-rights-management/commit/df6a6aa4e02ed1860e9a7431eda46597c75cc35d))
* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.34 to 0.0.3-next.35
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.34 to 0.0.3-next.35

## [0.0.3-next.34](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.33...rights-management-plugins-v0.0.3-next.34) (2026-05-13)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.33 to 0.0.3-next.34
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.33 to 0.0.3-next.34

## [0.0.3-next.33](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.32...rights-management-plugins-v0.0.3-next.33) (2026-05-11)


### Features

* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.32 to 0.0.3-next.33
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.32 to 0.0.3-next.33

## [0.0.3-next.32](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.31...rights-management-plugins-v0.0.3-next.32) (2026-05-05)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.31 to 0.0.3-next.32
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.31 to 0.0.3-next.32

## [0.0.3-next.31](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.30...rights-management-plugins-v0.0.3-next.31) (2026-05-01)


### Features

* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.30 to 0.0.3-next.31
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.30 to 0.0.3-next.31

## [0.0.3-next.30](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.29...rights-management-plugins-v0.0.3-next.30) (2026-04-29)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add pxp automation action ([#127](https://github.com/iotaledger/twin-rights-management/issues/127)) ([ea3325a](https://github.com/iotaledger/twin-rights-management/commit/ea3325a90c4714e599fcffb73e7517affd3a688f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.29 to 0.0.3-next.30
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.29 to 0.0.3-next.30

## [0.0.3-next.29](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.28...rights-management-plugins-v0.0.3-next.29) (2026-04-10)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.28 to 0.0.3-next.29
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.28 to 0.0.3-next.29

## [0.0.3-next.28](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.27...rights-management-plugins-v0.0.3-next.28) (2026-04-09)


### Features

* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.27 to 0.0.3-next.28
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.27 to 0.0.3-next.28

## [0.0.3-next.27](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.26...rights-management-plugins-v0.0.3-next.27) (2026-03-31)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.26 to 0.0.3-next.27
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.26 to 0.0.3-next.27

## [0.0.3-next.26](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.25...rights-management-plugins-v0.0.3-next.26) (2026-03-27)


### Features

* additional feature set for default policy arbiter ([#106](https://github.com/iotaledger/twin-rights-management/issues/106)) ([7081416](https://github.com/iotaledger/twin-rights-management/commit/70814160aae1d718065fe3f15532959b186f5af0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.25 to 0.0.3-next.26
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.25 to 0.0.3-next.26

## [0.0.3-next.25](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.24...rights-management-plugins-v0.0.3-next.25) (2026-03-20)


### Features

* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.24 to 0.0.3-next.25
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.24 to 0.0.3-next.25

## [0.0.3-next.24](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.23...rights-management-plugins-v0.0.3-next.24) (2026-03-17)


### Bug Fixes

* generate unique agreement UID to prevent overwriting offer in PAP ([#102](https://github.com/iotaledger/twin-rights-management/issues/102)) ([bd3dc1b](https://github.com/iotaledger/twin-rights-management/commit/bd3dc1bb240547c7642c7e90f67205bd34651662))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.23 to 0.0.3-next.24
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.23 to 0.0.3-next.24

## [0.0.3-next.23](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.22...rights-management-plugins-v0.0.3-next.23) (2026-03-13)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.22 to 0.0.3-next.23
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.22 to 0.0.3-next.23

## [0.0.3-next.22](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.21...rights-management-plugins-v0.0.3-next.22) (2026-03-09)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.21 to 0.0.3-next.22
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.21 to 0.0.3-next.22

## [0.0.3-next.21](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.20...rights-management-plugins-v0.0.3-next.21) (2026-03-06)


### Features

* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.20 to 0.0.3-next.21
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.20 to 0.0.3-next.21

## [0.0.3-next.20](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.19...rights-management-plugins-v0.0.3-next.20) (2026-02-27)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.19 to 0.0.3-next.20
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.19 to 0.0.3-next.20

## [0.0.3-next.19](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.18...rights-management-plugins-v0.0.3-next.19) (2026-02-26)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.18 to 0.0.3-next.19
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.18 to 0.0.3-next.19

## [0.0.3-next.18](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.17...rights-management-plugins-v0.0.3-next.18) (2026-02-26)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.17 to 0.0.3-next.18
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.17 to 0.0.3-next.18

## [0.0.3-next.17](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.16...rights-management-plugins-v0.0.3-next.17) (2026-02-25)


### Features

* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.16 to 0.0.3-next.17
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.16 to 0.0.3-next.17

## [0.0.3-next.16](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.15...rights-management-plugins-v0.0.3-next.16) (2026-02-24)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.15 to 0.0.3-next.16
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.14...rights-management-plugins-v0.0.3-next.15) (2026-02-12)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.14 to 0.0.3-next.15
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.14 to 0.0.3-next.15

## [0.0.3-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.13...rights-management-plugins-v0.0.3-next.14) (2026-02-12)


### Features

* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.13 to 0.0.3-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.13 to 0.0.3-next.14

## [0.0.3-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.12...rights-management-plugins-v0.0.3-next.13) (2026-02-02)


### Features

* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.11...rights-management-plugins-v0.0.3-next.12) (2026-02-02)


### Features

* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.10...rights-management-plugins-v0.0.3-next.11) (2026-01-29)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.9...rights-management-plugins-v0.0.3-next.10) (2026-01-28)


### Features

* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.8...rights-management-plugins-v0.0.3-next.9) (2026-01-26)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.7...rights-management-plugins-v0.0.3-next.8) (2026-01-21)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.6...rights-management-plugins-v0.0.3-next.7) (2026-01-14)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.5...rights-management-plugins-v0.0.3-next.6) (2026-01-12)


### Miscellaneous Chores

* **rights-management-plugins:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.4...rights-management-plugins-v0.0.3-next.5) (2026-01-06)


### Features

* add missing dependency ([f7c8e0e](https://github.com/iotaledger/twin-rights-management/commit/f7c8e0e4819c945ef823b853139440ad7999b9b9))
* add missing dependency ([c62a098](https://github.com/iotaledger/twin-rights-management/commit/c62a0983e912c252ab0c27261c9bb92a63c06f96))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-plugins-v0.0.3-next.3...rights-management-plugins-v0.0.3-next.4) (2025-12-04)


### Features

* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.3 to 0.0.3-next.4

## Changelog
