# Changelog

## Unreleased

### ⚠ BREAKING CHANGES

* remove EcosystemPolicy-specific negotiation guard and related locale contract for v2.

## [0.9.2-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.5...rights-management-pnp-service-v0.9.2-next.6) (2026-08-16)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.5 to 0.9.2-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.5 to 0.9.2-next.6

## [0.9.2-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.4...rights-management-pnp-service-v0.9.2-next.5) (2026-08-12)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.4 to 0.9.2-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.4 to 0.9.2-next.5

## [0.9.2-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.3...rights-management-pnp-service-v0.9.2-next.4) (2026-08-10)


### Features

* re-use existing agreements ([#287](https://github.com/iotaledger/twin-rights-management/issues/287)) ([08ddf92](https://github.com/iotaledger/twin-rights-management/commit/08ddf920faa75b78009ba60647f8cb76b7fc5253))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.3 to 0.9.2-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.3 to 0.9.2-next.4

## [0.9.2-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.2...rights-management-pnp-service-v0.9.2-next.3) (2026-08-07)


### Features

* linting and dependency update ([bb095f2](https://github.com/iotaledger/twin-rights-management/commit/bb095f23d761b2870711cd7ab174c2c7a8ace2ad))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.2 to 0.9.2-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.2 to 0.9.2-next.3

## [0.9.2-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.1...rights-management-pnp-service-v0.9.2-next.2) (2026-08-04)


### Bug Fixes

* don't terminate negotiation when callback delivery fails ([#282](https://github.com/iotaledger/twin-rights-management/issues/282)) ([4077b0d](https://github.com/iotaledger/twin-rights-management/commit/4077b0ddaeee2cbbd283e28639938482a5331393))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.1 to 0.9.2-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.1 to 0.9.2-next.2
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.1 to 0.9.2-next.2

## [0.9.2-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.2-next.0...rights-management-pnp-service-v0.9.2-next.1) (2026-07-30)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* check state before transitioning ([3d29807](https://github.com/iotaledger/twin-rights-management/commit/3d298076c29d43cea07ddf3bffbfafe0940d2879))
* configurable timeout for mutex ([d59d1b9](https://github.com/iotaledger/twin-rights-management/commit/d59d1b97996e5478aeee4adcb7c69246a238c78c))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* persist trust data ([#198](https://github.com/iotaledger/twin-rights-management/issues/198)) ([af94704](https://github.com/iotaledger/twin-rights-management/commit/af94704e366122f57ff6d664d3c51a371edfb043))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* support direct REQUESTED -&gt; AGREED contract negotiation shortcut ([#239](https://github.com/iotaledger/twin-rights-management/issues/239)) ([99aff32](https://github.com/iotaledger/twin-rights-management/commit/99aff32f867d097f8567bf61ed36996d194e3c0b))
* tenant component ([#165](https://github.com/iotaledger/twin-rights-management/issues/165)) ([de9eace](https://github.com/iotaledger/twin-rights-management/commit/de9eaceced899a21ca85fe30f422f2920f073928))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* callbackAddress optional on negotiation messages ([#158](https://github.com/iotaledger/twin-rights-management/issues/158)) ([dc8a539](https://github.com/iotaledger/twin-rights-management/commit/dc8a5394792ce024eeb8a5890d8c97962bde7222))
* contract negotiation feedback ([#151](https://github.com/iotaledger/twin-rights-management/issues/151)) ([b8bd1ec](https://github.com/iotaledger/twin-rights-management/commit/b8bd1ec72649ccc121362a9701577c3359ce90af))
* correct trust info capture ([f91a965](https://github.com/iotaledger/twin-rights-management/commit/f91a965d475cd06def56ecef3deb4e838d4c8fd8))
* notify requester via terminated() when consumer FINALIZED PAP write fails ([#185](https://github.com/iotaledger/twin-rights-management/issues/185)) ([cb8740d](https://github.com/iotaledger/twin-rights-management/commit/cb8740d4c127acf2a8550314b0dd337e38c842a0))
* persist correlationId in agreementFromProvider for the direct-agreement shortcut ([#268](https://github.com/iotaledger/twin-rights-management/issues/268)) ([ee32ad6](https://github.com/iotaledger/twin-rights-management/commit/ee32ad6809de4d5b918367d452a0d2d76054ab5e))
* persist finalized agreement to consumer PAP ([#170](https://github.com/iotaledger/twin-rights-management/issues/170)) ([f09a219](https://github.com/iotaledger/twin-rights-management/commit/f09a219847e13f2923be37b5111f3aed71ddfdfb))
* prevent record resurrection in terminateIfResponseError ([#164](https://github.com/iotaledger/twin-rights-management/issues/164)) ([03cd272](https://github.com/iotaledger/twin-rights-management/commit/03cd27295004f9842bd9dd39f3c4bfd9a7742203))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* store after delete ([#155](https://github.com/iotaledger/twin-rights-management/issues/155)) ([a0ff564](https://github.com/iotaledger/twin-rights-management/commit/a0ff564cad8727cbe008c4de2e6f3ecbbe043896))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))
* use the provider organization in the agreement callback address ([#181](https://github.com/iotaledger/twin-rights-management/issues/181)) ([527dce5](https://github.com/iotaledger/twin-rights-management/commit/527dce55a36a01be915a6fad88674beff216fa1b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.0 to 0.9.2-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.0 to 0.9.2-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.0 to 0.9.2-next.1

## [0.9.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1...rights-management-pnp-service-v0.9.1) (2026-07-27)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))
* release to production ([#275](https://github.com/iotaledger/twin-rights-management/issues/275)) ([a5dc94e](https://github.com/iotaledger/twin-rights-management/commit/a5dc94e7f207fce4c4806d8e8e124eeb180e7b15))

## [0.9.1-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.13...rights-management-pnp-service-v0.9.1-next.14) (2026-07-22)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.13 to 0.9.1-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.13 to 0.9.1-next.14
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.13 to 0.9.1-next.14

## [0.9.1-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.12...rights-management-pnp-service-v0.9.1-next.13) (2026-07-21)


### Bug Fixes

* persist correlationId in agreementFromProvider for the direct-agreement shortcut ([#268](https://github.com/iotaledger/twin-rights-management/issues/268)) ([ee32ad6](https://github.com/iotaledger/twin-rights-management/commit/ee32ad6809de4d5b918367d452a0d2d76054ab5e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.12 to 0.9.1-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.12 to 0.9.1-next.13
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.12 to 0.9.1-next.13

## [0.9.1-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.11...rights-management-pnp-service-v0.9.1-next.12) (2026-07-21)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.11 to 0.9.1-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.11 to 0.9.1-next.12
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.11 to 0.9.1-next.12

## [0.9.1-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.10...rights-management-pnp-service-v0.9.1-next.11) (2026-07-20)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.10 to 0.9.1-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.10 to 0.9.1-next.11
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.10 to 0.9.1-next.11

## [0.9.1-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.9...rights-management-pnp-service-v0.9.1-next.10) (2026-07-20)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.9 to 0.9.1-next.10
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.9 to 0.9.1-next.10
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.9 to 0.9.1-next.10

## [0.9.1-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.8...rights-management-pnp-service-v0.9.1-next.9) (2026-07-20)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.8 to 0.9.1-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.8 to 0.9.1-next.9
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.8 to 0.9.1-next.9

## [0.9.1-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.7...rights-management-pnp-service-v0.9.1-next.8) (2026-07-17)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.7 to 0.9.1-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.7 to 0.9.1-next.8
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.7 to 0.9.1-next.8

## [0.9.1-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.6...rights-management-pnp-service-v0.9.1-next.7) (2026-07-16)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.6 to 0.9.1-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.6 to 0.9.1-next.7
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.6 to 0.9.1-next.7

## [0.9.1-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.5...rights-management-pnp-service-v0.9.1-next.6) (2026-07-15)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.5 to 0.9.1-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.5 to 0.9.1-next.6
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.5 to 0.9.1-next.6

## [0.9.1-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.4...rights-management-pnp-service-v0.9.1-next.5) (2026-07-14)


### Features

* support direct REQUESTED -&gt; AGREED contract negotiation shortcut ([#239](https://github.com/iotaledger/twin-rights-management/issues/239)) ([99aff32](https://github.com/iotaledger/twin-rights-management/commit/99aff32f867d097f8567bf61ed36996d194e3c0b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.4 to 0.9.1-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.4 to 0.9.1-next.5
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.4 to 0.9.1-next.5

## [0.9.1-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.3...rights-management-pnp-service-v0.9.1-next.4) (2026-07-02)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.3 to 0.9.1-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.3 to 0.9.1-next.4
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.3 to 0.9.1-next.4

## [0.9.1-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.2...rights-management-pnp-service-v0.9.1-next.3) (2026-06-30)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.2 to 0.9.1-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.1...rights-management-pnp-service-v0.9.1-next.2) (2026-06-29)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.1 to 0.9.1-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.1-next.0...rights-management-pnp-service-v0.9.1-next.1) (2026-06-26)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* check state before transitioning ([3d29807](https://github.com/iotaledger/twin-rights-management/commit/3d298076c29d43cea07ddf3bffbfafe0940d2879))
* configurable timeout for mutex ([d59d1b9](https://github.com/iotaledger/twin-rights-management/commit/d59d1b97996e5478aeee4adcb7c69246a238c78c))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* persist trust data ([#198](https://github.com/iotaledger/twin-rights-management/issues/198)) ([af94704](https://github.com/iotaledger/twin-rights-management/commit/af94704e366122f57ff6d664d3c51a371edfb043))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* tenant component ([#165](https://github.com/iotaledger/twin-rights-management/issues/165)) ([de9eace](https://github.com/iotaledger/twin-rights-management/commit/de9eaceced899a21ca85fe30f422f2920f073928))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* callbackAddress optional on negotiation messages ([#158](https://github.com/iotaledger/twin-rights-management/issues/158)) ([dc8a539](https://github.com/iotaledger/twin-rights-management/commit/dc8a5394792ce024eeb8a5890d8c97962bde7222))
* contract negotiation feedback ([#151](https://github.com/iotaledger/twin-rights-management/issues/151)) ([b8bd1ec](https://github.com/iotaledger/twin-rights-management/commit/b8bd1ec72649ccc121362a9701577c3359ce90af))
* correct trust info capture ([f91a965](https://github.com/iotaledger/twin-rights-management/commit/f91a965d475cd06def56ecef3deb4e838d4c8fd8))
* notify requester via terminated() when consumer FINALIZED PAP write fails ([#185](https://github.com/iotaledger/twin-rights-management/issues/185)) ([cb8740d](https://github.com/iotaledger/twin-rights-management/commit/cb8740d4c127acf2a8550314b0dd337e38c842a0))
* persist finalized agreement to consumer PAP ([#170](https://github.com/iotaledger/twin-rights-management/issues/170)) ([f09a219](https://github.com/iotaledger/twin-rights-management/commit/f09a219847e13f2923be37b5111f3aed71ddfdfb))
* prevent record resurrection in terminateIfResponseError ([#164](https://github.com/iotaledger/twin-rights-management/issues/164)) ([03cd272](https://github.com/iotaledger/twin-rights-management/commit/03cd27295004f9842bd9dd39f3c4bfd9a7742203))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* store after delete ([#155](https://github.com/iotaledger/twin-rights-management/issues/155)) ([a0ff564](https://github.com/iotaledger/twin-rights-management/commit/a0ff564cad8727cbe008c4de2e6f3ecbbe043896))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))
* use the provider organization in the agreement callback address ([#181](https://github.com/iotaledger/twin-rights-management/issues/181)) ([527dce5](https://github.com/iotaledger/twin-rights-management/commit/527dce55a36a01be915a6fad88674beff216fa1b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.1-next.0 to 0.9.1-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.0...rights-management-pnp-service-v0.9.0) (2026-06-25)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))

## [0.9.0-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.9.0-next.0...rights-management-pnp-service-v0.9.0-next.1) (2026-06-23)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* check state before transitioning ([3d29807](https://github.com/iotaledger/twin-rights-management/commit/3d298076c29d43cea07ddf3bffbfafe0940d2879))
* configurable timeout for mutex ([d59d1b9](https://github.com/iotaledger/twin-rights-management/commit/d59d1b97996e5478aeee4adcb7c69246a238c78c))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* persist trust data ([#198](https://github.com/iotaledger/twin-rights-management/issues/198)) ([af94704](https://github.com/iotaledger/twin-rights-management/commit/af94704e366122f57ff6d664d3c51a371edfb043))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* tenant component ([#165](https://github.com/iotaledger/twin-rights-management/issues/165)) ([de9eace](https://github.com/iotaledger/twin-rights-management/commit/de9eaceced899a21ca85fe30f422f2920f073928))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* callbackAddress optional on negotiation messages ([#158](https://github.com/iotaledger/twin-rights-management/issues/158)) ([dc8a539](https://github.com/iotaledger/twin-rights-management/commit/dc8a5394792ce024eeb8a5890d8c97962bde7222))
* contract negotiation feedback ([#151](https://github.com/iotaledger/twin-rights-management/issues/151)) ([b8bd1ec](https://github.com/iotaledger/twin-rights-management/commit/b8bd1ec72649ccc121362a9701577c3359ce90af))
* correct trust info capture ([f91a965](https://github.com/iotaledger/twin-rights-management/commit/f91a965d475cd06def56ecef3deb4e838d4c8fd8))
* notify requester via terminated() when consumer FINALIZED PAP write fails ([#185](https://github.com/iotaledger/twin-rights-management/issues/185)) ([cb8740d](https://github.com/iotaledger/twin-rights-management/commit/cb8740d4c127acf2a8550314b0dd337e38c842a0))
* persist finalized agreement to consumer PAP ([#170](https://github.com/iotaledger/twin-rights-management/issues/170)) ([f09a219](https://github.com/iotaledger/twin-rights-management/commit/f09a219847e13f2923be37b5111f3aed71ddfdfb))
* prevent record resurrection in terminateIfResponseError ([#164](https://github.com/iotaledger/twin-rights-management/issues/164)) ([03cd272](https://github.com/iotaledger/twin-rights-management/commit/03cd27295004f9842bd9dd39f3c4bfd9a7742203))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* store after delete ([#155](https://github.com/iotaledger/twin-rights-management/issues/155)) ([a0ff564](https://github.com/iotaledger/twin-rights-management/commit/a0ff564cad8727cbe008c4de2e6f3ecbbe043896))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))
* use the provider organization in the agreement callback address ([#181](https://github.com/iotaledger/twin-rights-management/issues/181)) ([527dce5](https://github.com/iotaledger/twin-rights-management/commit/527dce55a36a01be915a6fad88674beff216fa1b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.0-next.0 to 0.9.0-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.58](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.57...rights-management-pnp-service-v0.0.3-next.58) (2026-06-19)


### Features

* local optimization ([#216](https://github.com/iotaledger/twin-rights-management/issues/216)) ([13858ea](https://github.com/iotaledger/twin-rights-management/commit/13858ea223654468b69c7ac5793fa6a03a0a61e0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.57 to 0.0.3-next.58
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.57 to 0.0.3-next.58
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.57 to 0.0.3-next.58

## [0.0.3-next.57](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.56...rights-management-pnp-service-v0.0.3-next.57) (2026-06-19)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.56 to 0.0.3-next.57
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.56 to 0.0.3-next.57
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.56 to 0.0.3-next.57

## [0.0.3-next.56](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.55...rights-management-pnp-service-v0.0.3-next.56) (2026-06-19)


### Features

* configurable timeout for mutex ([d59d1b9](https://github.com/iotaledger/twin-rights-management/commit/d59d1b97996e5478aeee4adcb7c69246a238c78c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.55 to 0.0.3-next.56
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.55 to 0.0.3-next.56
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.55 to 0.0.3-next.56

## [0.0.3-next.55](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.54...rights-management-pnp-service-v0.0.3-next.55) (2026-06-18)


### Features

* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.54 to 0.0.3-next.55
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.54 to 0.0.3-next.55
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.54 to 0.0.3-next.55

## [0.0.3-next.54](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.53...rights-management-pnp-service-v0.0.3-next.54) (2026-06-18)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.53 to 0.0.3-next.54
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.53 to 0.0.3-next.54
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.53 to 0.0.3-next.54

## [0.0.3-next.53](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.52...rights-management-pnp-service-v0.0.3-next.53) (2026-06-17)


### Bug Fixes

* correct trust info capture ([f91a965](https://github.com/iotaledger/twin-rights-management/commit/f91a965d475cd06def56ecef3deb4e838d4c8fd8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.52 to 0.0.3-next.53
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.52 to 0.0.3-next.53
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.52 to 0.0.3-next.53

## [0.0.3-next.52](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.51...rights-management-pnp-service-v0.0.3-next.52) (2026-06-17)


### Features

* persist trust data ([#198](https://github.com/iotaledger/twin-rights-management/issues/198)) ([af94704](https://github.com/iotaledger/twin-rights-management/commit/af94704e366122f57ff6d664d3c51a371edfb043))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.51 to 0.0.3-next.52
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.51 to 0.0.3-next.52
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.51 to 0.0.3-next.52

## [0.0.3-next.51](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.50...rights-management-pnp-service-v0.0.3-next.51) (2026-06-16)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.50 to 0.0.3-next.51
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.50 to 0.0.3-next.51
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.50 to 0.0.3-next.51

## [0.0.3-next.50](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.49...rights-management-pnp-service-v0.0.3-next.50) (2026-06-15)


### Features

* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.49 to 0.0.3-next.50
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.49 to 0.0.3-next.50
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.49 to 0.0.3-next.50

## [0.0.3-next.49](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.48...rights-management-pnp-service-v0.0.3-next.49) (2026-06-15)


### Bug Fixes

* notify requester via terminated() when consumer FINALIZED PAP write fails ([#185](https://github.com/iotaledger/twin-rights-management/issues/185)) ([cb8740d](https://github.com/iotaledger/twin-rights-management/commit/cb8740d4c127acf2a8550314b0dd337e38c842a0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.48 to 0.0.3-next.49
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.48 to 0.0.3-next.49
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.48 to 0.0.3-next.49

## [0.0.3-next.48](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.47...rights-management-pnp-service-v0.0.3-next.48) (2026-06-15)


### Features

* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))


### Bug Fixes

* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.47 to 0.0.3-next.48
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.47 to 0.0.3-next.48

## [0.0.3-next.47](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.46...rights-management-pnp-service-v0.0.3-next.47) (2026-06-12)


### Features

* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))


### Bug Fixes

* use the provider organization in the agreement callback address ([#181](https://github.com/iotaledger/twin-rights-management/issues/181)) ([527dce5](https://github.com/iotaledger/twin-rights-management/commit/527dce55a36a01be915a6fad88674beff216fa1b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.46 to 0.0.3-next.47
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.46 to 0.0.3-next.47
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.46 to 0.0.3-next.47

## [0.0.3-next.46](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.45...rights-management-pnp-service-v0.0.3-next.46) (2026-06-11)


### Features

* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.45 to 0.0.3-next.46
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.45 to 0.0.3-next.46
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.45 to 0.0.3-next.46

## [0.0.3-next.45](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.44...rights-management-pnp-service-v0.0.3-next.45) (2026-06-05)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* check state before transitioning ([3d29807](https://github.com/iotaledger/twin-rights-management/commit/3d298076c29d43cea07ddf3bffbfafe0940d2879))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* tenant component ([#165](https://github.com/iotaledger/twin-rights-management/issues/165)) ([de9eace](https://github.com/iotaledger/twin-rights-management/commit/de9eaceced899a21ca85fe30f422f2920f073928))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* callbackAddress optional on negotiation messages ([#158](https://github.com/iotaledger/twin-rights-management/issues/158)) ([dc8a539](https://github.com/iotaledger/twin-rights-management/commit/dc8a5394792ce024eeb8a5890d8c97962bde7222))
* contract negotiation feedback ([#151](https://github.com/iotaledger/twin-rights-management/issues/151)) ([b8bd1ec](https://github.com/iotaledger/twin-rights-management/commit/b8bd1ec72649ccc121362a9701577c3359ce90af))
* persist finalized agreement to consumer PAP ([#170](https://github.com/iotaledger/twin-rights-management/issues/170)) ([f09a219](https://github.com/iotaledger/twin-rights-management/commit/f09a219847e13f2923be37b5111f3aed71ddfdfb))
* prevent record resurrection in terminateIfResponseError ([#164](https://github.com/iotaledger/twin-rights-management/issues/164)) ([03cd272](https://github.com/iotaledger/twin-rights-management/commit/03cd27295004f9842bd9dd39f3c4bfd9a7742203))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* store after delete ([#155](https://github.com/iotaledger/twin-rights-management/issues/155)) ([a0ff564](https://github.com/iotaledger/twin-rights-management/commit/a0ff564cad8727cbe008c4de2e6f3ecbbe043896))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.44 to 0.0.3-next.45
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.44 to 0.0.3-next.45
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.44 to 0.0.3-next.45

## [0.0.3-next.44](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.43...rights-management-pnp-service-v0.0.3-next.44) (2026-06-05)


### Bug Fixes

* persist finalized agreement to consumer PAP ([#170](https://github.com/iotaledger/twin-rights-management/issues/170)) ([f09a219](https://github.com/iotaledger/twin-rights-management/commit/f09a219847e13f2923be37b5111f3aed71ddfdfb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.43 to 0.0.3-next.44
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.43 to 0.0.3-next.44
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.43 to 0.0.3-next.44

## [0.0.3-next.43](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.42...rights-management-pnp-service-v0.0.3-next.43) (2026-06-04)


### Bug Fixes

* prevent record resurrection in terminateIfResponseError ([#164](https://github.com/iotaledger/twin-rights-management/issues/164)) ([03cd272](https://github.com/iotaledger/twin-rights-management/commit/03cd27295004f9842bd9dd39f3c4bfd9a7742203))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.42 to 0.0.3-next.43
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.42 to 0.0.3-next.43
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.42 to 0.0.3-next.43

## [0.0.3-next.42](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.41...rights-management-pnp-service-v0.0.3-next.42) (2026-06-04)


### Features

* tenant component ([#165](https://github.com/iotaledger/twin-rights-management/issues/165)) ([de9eace](https://github.com/iotaledger/twin-rights-management/commit/de9eaceced899a21ca85fe30f422f2920f073928))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.41 to 0.0.3-next.42
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.41 to 0.0.3-next.42
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.41 to 0.0.3-next.42

## [0.0.3-next.41](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.40...rights-management-pnp-service-v0.0.3-next.41) (2026-06-03)


### Bug Fixes

* callbackAddress optional on negotiation messages ([#158](https://github.com/iotaledger/twin-rights-management/issues/158)) ([dc8a539](https://github.com/iotaledger/twin-rights-management/commit/dc8a5394792ce024eeb8a5890d8c97962bde7222))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.40 to 0.0.3-next.41
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.40 to 0.0.3-next.41
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.40 to 0.0.3-next.41

## [0.0.3-next.40](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.39...rights-management-pnp-service-v0.0.3-next.40) (2026-06-03)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.39 to 0.0.3-next.40
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.39 to 0.0.3-next.40
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.39 to 0.0.3-next.40

## [0.0.3-next.39](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.38...rights-management-pnp-service-v0.0.3-next.39) (2026-06-02)


### Bug Fixes

* store after delete ([#155](https://github.com/iotaledger/twin-rights-management/issues/155)) ([a0ff564](https://github.com/iotaledger/twin-rights-management/commit/a0ff564cad8727cbe008c4de2e6f3ecbbe043896))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.38 to 0.0.3-next.39
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.38 to 0.0.3-next.39
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.38 to 0.0.3-next.39

## [0.0.3-next.38](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.37...rights-management-pnp-service-v0.0.3-next.38) (2026-06-02)


### Features

* check state before transitioning ([3d29807](https://github.com/iotaledger/twin-rights-management/commit/3d298076c29d43cea07ddf3bffbfafe0940d2879))


### Bug Fixes

* contract negotiation feedback ([#151](https://github.com/iotaledger/twin-rights-management/issues/151)) ([b8bd1ec](https://github.com/iotaledger/twin-rights-management/commit/b8bd1ec72649ccc121362a9701577c3359ce90af))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.37 to 0.0.3-next.38
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.37 to 0.0.3-next.38
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.37 to 0.0.3-next.38

## [0.0.3-next.37](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.36...rights-management-pnp-service-v0.0.3-next.37) (2026-05-26)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.36 to 0.0.3-next.37
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.36 to 0.0.3-next.37
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.36 to 0.0.3-next.37

## [0.0.3-next.36](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.35...rights-management-pnp-service-v0.0.3-next.36) (2026-05-20)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.35 to 0.0.3-next.36
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.35 to 0.0.3-next.36

## [0.0.3-next.35](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.34...rights-management-pnp-service-v0.0.3-next.35) (2026-05-20)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))
* add includeErrorDetails config ([4e5cb52](https://github.com/iotaledger/twin-rights-management/commit/4e5cb52b6fa5a5915e36053cfc48bec763070e29))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.34 to 0.0.3-next.35
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.34 to 0.0.3-next.35

## [0.0.3-next.34](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.33...rights-management-pnp-service-v0.0.3-next.34) (2026-05-13)


### Features

* unused services ([1d73d35](https://github.com/iotaledger/twin-rights-management/commit/1d73d3523ac496883845ffc8c1899e647952ee12))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.33 to 0.0.3-next.34
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.33 to 0.0.3-next.34

## [0.0.3-next.33](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.32...rights-management-pnp-service-v0.0.3-next.33) (2026-05-11)


### Features

* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.32 to 0.0.3-next.33
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.32 to 0.0.3-next.33

## [0.0.3-next.32](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.31...rights-management-pnp-service-v0.0.3-next.32) (2026-05-05)


### Features

* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.31 to 0.0.3-next.32
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.31 to 0.0.3-next.32

## [0.0.3-next.31](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.30...rights-management-pnp-service-v0.0.3-next.31) (2026-05-01)


### Features

* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.30 to 0.0.3-next.31
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.30 to 0.0.3-next.31

## [0.0.3-next.30](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.29...rights-management-pnp-service-v0.0.3-next.30) (2026-04-29)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.29 to 0.0.3-next.30
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.29 to 0.0.3-next.30

## [0.0.3-next.29](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.28...rights-management-pnp-service-v0.0.3-next.29) (2026-04-10)


### Features

* use tenant admin service instead of custom tenant tracking ([#118](https://github.com/iotaledger/twin-rights-management/issues/118)) ([905745c](https://github.com/iotaledger/twin-rights-management/commit/905745cec18ecf27d8b550ee0a8aaf103d0d69da))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.28 to 0.0.3-next.29
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.28 to 0.0.3-next.29

## [0.0.3-next.28](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.27...rights-management-pnp-service-v0.0.3-next.28) (2026-04-09)


### Features

* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.27 to 0.0.3-next.28
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.27 to 0.0.3-next.28

## [0.0.3-next.27](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.26...rights-management-pnp-service-v0.0.3-next.27) (2026-03-31)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.26 to 0.0.3-next.27
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.26 to 0.0.3-next.27

## [0.0.3-next.26](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.25...rights-management-pnp-service-v0.0.3-next.26) (2026-03-27)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.25 to 0.0.3-next.26
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.25 to 0.0.3-next.26

## [0.0.3-next.25](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.24...rights-management-pnp-service-v0.0.3-next.25) (2026-03-20)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.24 to 0.0.3-next.25
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.24 to 0.0.3-next.25

## [0.0.3-next.24](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.23...rights-management-pnp-service-v0.0.3-next.24) (2026-03-17)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.23 to 0.0.3-next.24
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.23 to 0.0.3-next.24

## [0.0.3-next.23](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.22...rights-management-pnp-service-v0.0.3-next.23) (2026-03-13)


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.22 to 0.0.3-next.23
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.22 to 0.0.3-next.23

## [0.0.3-next.22](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.21...rights-management-pnp-service-v0.0.3-next.22) (2026-03-09)


### Features

* add identity-based authorization to PNP negotiation endpoints ([#92](https://github.com/iotaledger/twin-rights-management/issues/92)) ([67c208e](https://github.com/iotaledger/twin-rights-management/commit/67c208e0c7da637c4194e5412f51a2d084ae1df2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.21 to 0.0.3-next.22
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.21 to 0.0.3-next.22

## [0.0.3-next.21](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.20...rights-management-pnp-service-v0.0.3-next.21) (2026-03-06)


### Features

* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.20 to 0.0.3-next.21
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.20 to 0.0.3-next.21

## [0.0.3-next.20](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.19...rights-management-pnp-service-v0.0.3-next.20) (2026-02-27)


### Features

* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.19 to 0.0.3-next.20
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.19 to 0.0.3-next.20

## [0.0.3-next.19](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.18...rights-management-pnp-service-v0.0.3-next.19) (2026-02-26)


### Features

* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.18 to 0.0.3-next.19
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.18 to 0.0.3-next.19

## [Unreleased]

### Features

* expired negotiation cleanup now sends terminate to consumer when `policyNegotiationPointComponentType` is configured

## [0.0.3-next.17](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.16...rights-management-pnp-service-v0.0.3-next.17) (2026-02-25)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.16 to 0.0.3-next.17
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.16 to 0.0.3-next.17

## [0.0.3-next.16](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.15...rights-management-pnp-service-v0.0.3-next.16) (2026-02-24)


### Features

* pass negotiationId instead of requesterType to IPolicyRequester callbacks ([#80](https://github.com/iotaledger/twin-rights-management/issues/80)) ([1dbaa42](https://github.com/iotaledger/twin-rights-management/commit/1dbaa422b2d419829ca0d307a4072bab6d69c2fe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.15 to 0.0.3-next.16
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.14...rights-management-pnp-service-v0.0.3-next.15) (2026-02-12)


### Features

* policy negotiation point remote optional in config ([01ad107](https://github.com/iotaledger/twin-rights-management/commit/01ad10773f4de3dfb13a43e53ba366cbcd4add1a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.14 to 0.0.3-next.15
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.14 to 0.0.3-next.15

## [0.0.3-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.13...rights-management-pnp-service-v0.0.3-next.14) (2026-02-12)


### Features

* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.13 to 0.0.3-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.13 to 0.0.3-next.14

## [0.0.3-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.12...rights-management-pnp-service-v0.0.3-next.13) (2026-02-02)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.12 to 0.0.3-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.11...rights-management-pnp-service-v0.0.3-next.12) (2026-02-02)


### Features

* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.11 to 0.0.3-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.10...rights-management-pnp-service-v0.0.3-next.11) (2026-01-29)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.10 to 0.0.3-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.9...rights-management-pnp-service-v0.0.3-next.10) (2026-01-28)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.9 to 0.0.3-next.10
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.8...rights-management-pnp-service-v0.0.3-next.9) (2026-01-26)


### Features

* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.8 to 0.0.3-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.7...rights-management-pnp-service-v0.0.3-next.8) (2026-01-21)


### Features

* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.7 to 0.0.3-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.6...rights-management-pnp-service-v0.0.3-next.7) (2026-01-14)


### Features

* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.6 to 0.0.3-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.5...rights-management-pnp-service-v0.0.3-next.6) (2026-01-12)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.5 to 0.0.3-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.4...rights-management-pnp-service-v0.0.3-next.5) (2026-01-06)


### Features

* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.4 to 0.0.3-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.3...rights-management-pnp-service-v0.0.3-next.4) (2025-12-04)


### Features

* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.3 to 0.0.3-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.2...rights-management-pnp-service-v0.0.3-next.3) (2025-11-28)


### Features

* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.2 to 0.0.3-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.1...rights-management-pnp-service-v0.0.3-next.2) (2025-11-20)


### Features

* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.1 to 0.0.3-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.1 to 0.0.3-next.2

## [0.0.3-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.3-next.0...rights-management-pnp-service-v0.0.3-next.1) (2025-11-11)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.0 to 0.0.3-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.0 to 0.0.3-next.1

## [0.0.2-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.13...rights-management-pnp-service-v0.0.2-next.14) (2025-10-09)


### Features

* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* update naming ([46accce](https://github.com/iotaledger/twin-rights-management/commit/46accce4bee443453c1bc4c1c1863cf2b755efea))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.13 to 0.0.2-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.13 to 0.0.2-next.14

## [0.0.2-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.12...rights-management-pnp-service-v0.0.2-next.13) (2025-09-23)


### Features

* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.12 to 0.0.2-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.12 to 0.0.2-next.13

## [0.0.2-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.11...rights-management-pnp-service-v0.0.2-next.12) (2025-09-22)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.11 to 0.0.2-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.11 to 0.0.2-next.12

## [0.0.2-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.10...rights-management-pnp-service-v0.0.2-next.11) (2025-09-19)


### Features

* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.10 to 0.0.2-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.10 to 0.0.2-next.11

## [0.0.2-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.9...rights-management-pnp-service-v0.0.2-next.10) (2025-09-19)


### Features

* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.9 to 0.0.2-next.10
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.9 to 0.0.2-next.10

## [0.0.2-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.8...rights-management-pnp-service-v0.0.2-next.9) (2025-09-08)


### Features

* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.8 to 0.0.2-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.8 to 0.0.2-next.9

## [0.0.2-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.7...rights-management-pnp-service-v0.0.2-next.8) (2025-09-05)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.7 to 0.0.2-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.7 to 0.0.2-next.8

## [0.0.2-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.6...rights-management-pnp-service-v0.0.2-next.7) (2025-09-05)


### Miscellaneous Chores

* **rights-management-pnp-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.6 to 0.0.2-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.6 to 0.0.2-next.7

## [0.0.2-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.5...rights-management-pnp-service-v0.0.2-next.6) (2025-09-05)


### Features

* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.5 to 0.0.2-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.5 to 0.0.2-next.6

## [0.0.2-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-pnp-service-v0.0.2-next.4...rights-management-pnp-service-v0.0.2-next.5) (2025-09-05)


### Features

* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.4 to 0.0.2-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.4 to 0.0.2-next.5

## Changelog
