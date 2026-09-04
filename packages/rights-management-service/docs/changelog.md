# Changelog

## Unreleased

### ⚠ BREAKING CHANGES

* remove EcosystemPolicy support from PAP/REST routes and generated API surface for v2.

## [0.9.3-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.3-next.1...rights-management-service-v0.9.3-next.2) (2026-09-04)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.3-next.1 to 0.9.3-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pdp-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pep-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pip-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pmp-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pnp-service bumped from 0.9.3-next.1 to 0.9.3-next.2
    * @twin.org/rights-management-pxp-service bumped from 0.9.3-next.1 to 0.9.3-next.2

## [0.9.3-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.3-next.0...rights-management-service-v0.9.3-next.1) (2026-09-04)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add type to pap query request ([#270](https://github.com/iotaledger/twin-rights-management/issues/270)) ([a94779a](https://github.com/iotaledger/twin-rights-management/commit/a94779a0f1331811258801aa899b70b414886972))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* enhanced rest testing ([#227](https://github.com/iotaledger/twin-rights-management/issues/227)) ([f76c137](https://github.com/iotaledger/twin-rights-management/commit/f76c13781c987e0fd153aa316abfd27113317fad))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* linting and dependency update ([bb095f2](https://github.com/iotaledger/twin-rights-management/commit/bb095f23d761b2870711cd7ab174c2c7a8ace2ad))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* query properties ([#289](https://github.com/iotaledger/twin-rights-management/issues/289)) ([e2481f2](https://github.com/iotaledger/twin-rights-management/commit/e2481f256e8b74c2bf56dca6d9df817919ab8a3a))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rest enhancements ([#229](https://github.com/iotaledger/twin-rights-management/issues/229)) ([b48de25](https://github.com/iotaledger/twin-rights-management/commit/b48de25820eddb4cc53020bb2afbd91497d22de5))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* return built location header in papCreate ([#279](https://github.com/iotaledger/twin-rights-management/issues/279)) ([8ccd460](https://github.com/iotaledger/twin-rights-management/commit/8ccd460a7aa395090e110122acb8fadabec8df0b))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))
* translate PAP query properties to storage keys ([#293](https://github.com/iotaledger/twin-rights-management/issues/293)) ([b4206c4](https://github.com/iotaledger/twin-rights-management/commit/b4206c4687bff4a4e2cab996fcf9ec2c77268012))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.3-next.0 to 0.9.3-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pdp-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pep-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pip-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pmp-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pnp-service bumped from 0.9.3-next.0 to 0.9.3-next.1
    * @twin.org/rights-management-pxp-service bumped from 0.9.3-next.0 to 0.9.3-next.1

## [0.9.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2...rights-management-service-v0.9.2) (2026-08-24)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))
* release to production ([#275](https://github.com/iotaledger/twin-rights-management/issues/275)) ([a5dc94e](https://github.com/iotaledger/twin-rights-management/commit/a5dc94e7f207fce4c4806d8e8e124eeb180e7b15))
* release to production ([#300](https://github.com/iotaledger/twin-rights-management/issues/300)) ([1151a4d](https://github.com/iotaledger/twin-rights-management/commit/1151a4d337d92ce6c25e685a78cefbe9a23f64e0))

## [0.9.2-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.6...rights-management-service-v0.9.2-next.7) (2026-08-16)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add type to pap query request ([#270](https://github.com/iotaledger/twin-rights-management/issues/270)) ([a94779a](https://github.com/iotaledger/twin-rights-management/commit/a94779a0f1331811258801aa899b70b414886972))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* enhanced rest testing ([#227](https://github.com/iotaledger/twin-rights-management/issues/227)) ([f76c137](https://github.com/iotaledger/twin-rights-management/commit/f76c13781c987e0fd153aa316abfd27113317fad))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* linting and dependency update ([bb095f2](https://github.com/iotaledger/twin-rights-management/commit/bb095f23d761b2870711cd7ab174c2c7a8ace2ad))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* query properties ([#289](https://github.com/iotaledger/twin-rights-management/issues/289)) ([e2481f2](https://github.com/iotaledger/twin-rights-management/commit/e2481f256e8b74c2bf56dca6d9df817919ab8a3a))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rest enhancements ([#229](https://github.com/iotaledger/twin-rights-management/issues/229)) ([b48de25](https://github.com/iotaledger/twin-rights-management/commit/b48de25820eddb4cc53020bb2afbd91497d22de5))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* return built location header in papCreate ([#279](https://github.com/iotaledger/twin-rights-management/issues/279)) ([8ccd460](https://github.com/iotaledger/twin-rights-management/commit/8ccd460a7aa395090e110122acb8fadabec8df0b))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))
* translate PAP query properties to storage keys ([#293](https://github.com/iotaledger/twin-rights-management/issues/293)) ([b4206c4](https://github.com/iotaledger/twin-rights-management/commit/b4206c4687bff4a4e2cab996fcf9ec2c77268012))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.6 to 0.9.2-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.6 to 0.9.2-next.7
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.6 to 0.9.2-next.7

## [0.9.2-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.5...rights-management-service-v0.9.2-next.6) (2026-08-16)


### Bug Fixes

* translate PAP query properties to storage keys ([#293](https://github.com/iotaledger/twin-rights-management/issues/293)) ([b4206c4](https://github.com/iotaledger/twin-rights-management/commit/b4206c4687bff4a4e2cab996fcf9ec2c77268012))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.5 to 0.9.2-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.5 to 0.9.2-next.6
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.5 to 0.9.2-next.6

## [0.9.2-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.4...rights-management-service-v0.9.2-next.5) (2026-08-12)


### Features

* query properties ([#289](https://github.com/iotaledger/twin-rights-management/issues/289)) ([e2481f2](https://github.com/iotaledger/twin-rights-management/commit/e2481f256e8b74c2bf56dca6d9df817919ab8a3a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.4 to 0.9.2-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.4 to 0.9.2-next.5
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.4 to 0.9.2-next.5

## [0.9.2-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.3...rights-management-service-v0.9.2-next.4) (2026-08-10)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.3 to 0.9.2-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.3 to 0.9.2-next.4
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.3 to 0.9.2-next.4

## [0.9.2-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.2...rights-management-service-v0.9.2-next.3) (2026-08-07)


### Features

* linting and dependency update ([bb095f2](https://github.com/iotaledger/twin-rights-management/commit/bb095f23d761b2870711cd7ab174c2c7a8ace2ad))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.9.2-next.2 to 0.9.2-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pdp-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pep-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pip-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pmp-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pnp-service bumped from 0.9.2-next.2 to 0.9.2-next.3
    * @twin.org/rights-management-pxp-service bumped from 0.9.2-next.2 to 0.9.2-next.3

## [0.9.2-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.1...rights-management-service-v0.9.2-next.2) (2026-08-04)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.2-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.2-next.0...rights-management-service-v0.9.2-next.1) (2026-07-30)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add type to pap query request ([#270](https://github.com/iotaledger/twin-rights-management/issues/270)) ([a94779a](https://github.com/iotaledger/twin-rights-management/commit/a94779a0f1331811258801aa899b70b414886972))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* enhanced rest testing ([#227](https://github.com/iotaledger/twin-rights-management/issues/227)) ([f76c137](https://github.com/iotaledger/twin-rights-management/commit/f76c13781c987e0fd153aa316abfd27113317fad))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rest enhancements ([#229](https://github.com/iotaledger/twin-rights-management/issues/229)) ([b48de25](https://github.com/iotaledger/twin-rights-management/commit/b48de25820eddb4cc53020bb2afbd91497d22de5))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* return built location header in papCreate ([#279](https://github.com/iotaledger/twin-rights-management/issues/279)) ([8ccd460](https://github.com/iotaledger/twin-rights-management/commit/8ccd460a7aa395090e110122acb8fadabec8df0b))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))
* use async getStore in tests ([61b9951](https://github.com/iotaledger/twin-rights-management/commit/61b99512f90faa26d22d57b6fbd3186a5cb53672))


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

## [0.9.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1...rights-management-service-v0.9.1) (2026-07-27)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))
* release to production ([#275](https://github.com/iotaledger/twin-rights-management/issues/275)) ([a5dc94e](https://github.com/iotaledger/twin-rights-management/commit/a5dc94e7f207fce4c4806d8e8e124eeb180e7b15))

## [0.9.1-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.13...rights-management-service-v0.9.1-next.14) (2026-07-22)


### Features

* add type to pap query request ([#270](https://github.com/iotaledger/twin-rights-management/issues/270)) ([a94779a](https://github.com/iotaledger/twin-rights-management/commit/a94779a0f1331811258801aa899b70b414886972))


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

## [0.9.1-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.12...rights-management-service-v0.9.1-next.13) (2026-07-21)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.11...rights-management-service-v0.9.1-next.12) (2026-07-21)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.10...rights-management-service-v0.9.1-next.11) (2026-07-20)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.9...rights-management-service-v0.9.1-next.10) (2026-07-20)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.8...rights-management-service-v0.9.1-next.9) (2026-07-20)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.7...rights-management-service-v0.9.1-next.8) (2026-07-17)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.6...rights-management-service-v0.9.1-next.7) (2026-07-16)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.5...rights-management-service-v0.9.1-next.6) (2026-07-15)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.4...rights-management-service-v0.9.1-next.5) (2026-07-14)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.3...rights-management-service-v0.9.1-next.4) (2026-07-02)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.9.1-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.2...rights-management-service-v0.9.1-next.3) (2026-06-30)


### Features

* rest enhancements ([#229](https://github.com/iotaledger/twin-rights-management/issues/229)) ([b48de25](https://github.com/iotaledger/twin-rights-management/commit/b48de25820eddb4cc53020bb2afbd91497d22de5))


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

## [0.9.1-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.1...rights-management-service-v0.9.1-next.2) (2026-06-29)


### Features

* enhanced rest testing ([#227](https://github.com/iotaledger/twin-rights-management/issues/227)) ([f76c137](https://github.com/iotaledger/twin-rights-management/commit/f76c13781c987e0fd153aa316abfd27113317fad))


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

## [0.9.1-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.1-next.0...rights-management-service-v0.9.1-next.1) (2026-06-26)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))
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

## [0.9.0](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.0...rights-management-service-v0.9.0) (2026-06-25)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))
* release to production ([#223](https://github.com/iotaledger/twin-rights-management/issues/223)) ([8188fe6](https://github.com/iotaledger/twin-rights-management/commit/8188fe643107e3d4989b45a313d3f451e51e4b52))

## [0.9.0-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.9.0-next.0...rights-management-service-v0.9.0-next.1) (2026-06-23)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))
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

## [0.0.3-next.58](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.57...rights-management-service-v0.0.3-next.58) (2026-06-19)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.57](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.56...rights-management-service-v0.0.3-next.57) (2026-06-19)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.56](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.55...rights-management-service-v0.0.3-next.56) (2026-06-19)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.55](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.54...rights-management-service-v0.0.3-next.55) (2026-06-18)


### Features

* remove hosting component ([#207](https://github.com/iotaledger/twin-rights-management/issues/207)) ([2a51690](https://github.com/iotaledger/twin-rights-management/commit/2a5169085b7df2245a474580e88b5b4e501006fe))


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

## [0.0.3-next.54](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.53...rights-management-service-v0.0.3-next.54) (2026-06-18)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.53](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.52...rights-management-service-v0.0.3-next.53) (2026-06-17)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.52](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.51...rights-management-service-v0.0.3-next.52) (2026-06-17)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.51](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.50...rights-management-service-v0.0.3-next.51) (2026-06-16)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.50](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.49...rights-management-service-v0.0.3-next.50) (2026-06-15)


### Features

* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))


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

## [0.0.3-next.49](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.48...rights-management-service-v0.0.3-next.49) (2026-06-15)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.48](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.47...rights-management-service-v0.0.3-next.48) (2026-06-15)


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
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.47 to 0.0.3-next.48
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.47 to 0.0.3-next.48

## [0.0.3-next.47](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.46...rights-management-service-v0.0.3-next.47) (2026-06-12)


### Features

* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))


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

## [0.0.3-next.46](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.45...rights-management-service-v0.0.3-next.46) (2026-06-11)


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

## [0.0.3-next.45](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.44...rights-management-service-v0.0.3-next.45) (2026-06-05)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))
* make logging tests deterministic and complete hosting mock ([#173](https://github.com/iotaledger/twin-rights-management/issues/173)) ([80fa587](https://github.com/iotaledger/twin-rights-management/commit/80fa587a83cb73ab0cfc14b40fa7b878ccf64da5))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


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

## [0.0.3-next.44](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.43...rights-management-service-v0.0.3-next.44) (2026-06-05)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.43](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.42...rights-management-service-v0.0.3-next.43) (2026-06-04)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.42](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.41...rights-management-service-v0.0.3-next.42) (2026-06-04)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.41](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.40...rights-management-service-v0.0.3-next.41) (2026-06-03)


### Bug Fixes

* comment ([6ddc741](https://github.com/iotaledger/twin-rights-management/commit/6ddc7410088865de7bd68c814221f747de43a13f))


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

## [0.0.3-next.40](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.39...rights-management-service-v0.0.3-next.40) (2026-06-03)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.39](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.38...rights-management-service-v0.0.3-next.39) (2026-06-02)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.38](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.37...rights-management-service-v0.0.3-next.38) (2026-06-02)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.37](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.36...rights-management-service-v0.0.3-next.37) (2026-05-26)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


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

## [0.0.3-next.36](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.35...rights-management-service-v0.0.3-next.36) (2026-05-20)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


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

## [0.0.3-next.35](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.34...rights-management-service-v0.0.3-next.35) (2026-05-20)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* improve json path handling ([#133](https://github.com/iotaledger/twin-rights-management/issues/133)) ([0a3c0c4](https://github.com/iotaledger/twin-rights-management/commit/0a3c0c41f15f74a6e2463ed9802c7b662d3e95f6))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))
* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


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

## [0.0.3-next.34](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.33...rights-management-service-v0.0.3-next.34) (2026-05-13)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.33](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.32...rights-management-service-v0.0.3-next.33) (2026-05-11)


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

## [0.0.3-next.32](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.31...rights-management-service-v0.0.3-next.32) (2026-05-05)


### Features

* use url transformer ([79b3b91](https://github.com/iotaledger/twin-rights-management/commit/79b3b918e622a11621548c5fe80ed77c335e947b))


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

## [0.0.3-next.31](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.30...rights-management-service-v0.0.3-next.31) (2026-05-01)


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

## [0.0.3-next.30](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.29...rights-management-service-v0.0.3-next.30) (2026-04-29)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.29](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.28...rights-management-service-v0.0.3-next.29) (2026-04-10)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.28](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.27...rights-management-service-v0.0.3-next.28) (2026-04-09)


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

## [0.0.3-next.27](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.26...rights-management-service-v0.0.3-next.27) (2026-03-31)


### Features

* add skipTenant to PNP route definitions ([#110](https://github.com/iotaledger/twin-rights-management/issues/110)) ([5a8e925](https://github.com/iotaledger/twin-rights-management/commit/5a8e925868c94d12e382e184c5a16ee8135194b1))


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

## [0.0.3-next.26](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.25...rights-management-service-v0.0.3-next.26) (2026-03-27)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.25](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.24...rights-management-service-v0.0.3-next.25) (2026-03-20)


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

## [0.0.3-next.24](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.23...rights-management-service-v0.0.3-next.24) (2026-03-17)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.23](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.22...rights-management-service-v0.0.3-next.23) (2026-03-13)


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))


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

## [0.0.3-next.22](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.21...rights-management-service-v0.0.3-next.22) (2026-03-09)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.21](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.20...rights-management-service-v0.0.3-next.21) (2026-03-06)


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

## [0.0.3-next.20](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.19...rights-management-service-v0.0.3-next.20) (2026-02-27)


### Features

* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))


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

## [0.0.3-next.19](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.18...rights-management-service-v0.0.3-next.19) (2026-02-26)


### Features

* add includeErrorDetails config ([73af46f](https://github.com/iotaledger/twin-rights-management/commit/73af46fa92fb7661334dc4674219705724967d79))


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

## [0.0.3-next.18](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.17...rights-management-service-v0.0.3-next.18) (2026-02-26)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.17](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.16...rights-management-service-v0.0.3-next.17) (2026-02-25)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))
* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))
* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


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

## [0.0.3-next.16](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.15...rights-management-service-v0.0.3-next.16) (2026-02-24)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.15](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.14...rights-management-service-v0.0.3-next.15) (2026-02-12)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


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

## [0.0.3-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.13...rights-management-service-v0.0.3-next.14) (2026-02-12)


### Features

* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))


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

## [0.0.3-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.12...rights-management-service-v0.0.3-next.13) (2026-02-02)


### Features

* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.12 to 0.0.3-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.11...rights-management-service-v0.0.3-next.12) (2026-02-02)


### Features

* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.11 to 0.0.3-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.10...rights-management-service-v0.0.3-next.11) (2026-01-29)


### Features

* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.10 to 0.0.3-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.9...rights-management-service-v0.0.3-next.10) (2026-01-28)


### Features

* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* update naming ([e75ae80](https://github.com/iotaledger/twin-rights-management/commit/e75ae80dcf3d8099a1dea32ef498efb640de52ef))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.9 to 0.0.3-next.10
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.8...rights-management-service-v0.0.3-next.9) (2026-01-26)


### Features

* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.8 to 0.0.3-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.7...rights-management-service-v0.0.3-next.8) (2026-01-21)


### Features

* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.7 to 0.0.3-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.6...rights-management-service-v0.0.3-next.7) (2026-01-14)


### Features

* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.6 to 0.0.3-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.5...rights-management-service-v0.0.3-next.6) (2026-01-12)


### Features

* use per request http headers ([#59](https://github.com/iotaledger/twin-rights-management/issues/59)) ([8806642](https://github.com/iotaledger/twin-rights-management/commit/88066429c362ac98fb870727a4fc55c9b533f1a4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.5 to 0.0.3-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.4...rights-management-service-v0.0.3-next.5) (2026-01-06)


### Features

* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.4 to 0.0.3-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.3...rights-management-service-v0.0.3-next.4) (2025-12-04)


### Features

* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.3 to 0.0.3-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.2...rights-management-service-v0.0.3-next.3) (2025-11-28)


### Features

* update dataspace standards packages ([dbd5bf6](https://github.com/iotaledger/twin-rights-management/commit/dbd5bf62403a97c758ee2320d9cac378c568165b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.2 to 0.0.3-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.1...rights-management-service-v0.0.3-next.2) (2025-11-20)


### Features

* update dataspace protocol dependencies ([9dcc477](https://github.com/iotaledger/twin-rights-management/commit/9dcc47755c2f5a7fd3ef30e656f1988944cd4b54))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.1 to 0.0.3-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.1 to 0.0.3-next.2

## [0.0.3-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.3-next.0...rights-management-service-v0.0.3-next.1) (2025-11-11)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))
* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.3-next.0 to 0.0.3-next.1
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pdp-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pep-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pip-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pmp-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pnp-service bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/rights-management-pxp-service bumped from 0.0.3-next.0 to 0.0.3-next.1

## [0.0.2-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.13...rights-management-service-v0.0.2-next.14) (2025-10-09)


### Features

* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.13 to 0.0.2-next.14
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.13 to 0.0.2-next.14
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.13 to 0.0.2-next.14

## [0.0.2-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.12...rights-management-service-v0.0.2-next.13) (2025-09-23)


### Features

* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.12 to 0.0.2-next.13
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.12 to 0.0.2-next.13
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.12 to 0.0.2-next.13

## [0.0.2-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.11...rights-management-service-v0.0.2-next.12) (2025-09-22)


### Features

* use Bearer format for token headers ([74d7d7c](https://github.com/iotaledger/twin-rights-management/commit/74d7d7cc59906c78798f78c5ed9211a3ee8dcd10))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.11 to 0.0.2-next.12
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.11 to 0.0.2-next.12
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.11 to 0.0.2-next.12

## [0.0.2-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.10...rights-management-service-v0.0.2-next.11) (2025-09-19)


### Features

* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.10 to 0.0.2-next.11
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.10 to 0.0.2-next.11
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.10 to 0.0.2-next.11

## [0.0.2-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.9...rights-management-service-v0.0.2-next.10) (2025-09-19)


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
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.9 to 0.0.2-next.10

## [0.0.2-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.8...rights-management-service-v0.0.2-next.9) (2025-09-08)


### Features

* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.8 to 0.0.2-next.9
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.8 to 0.0.2-next.9

## [0.0.2-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.7...rights-management-service-v0.0.2-next.8) (2025-09-05)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.7 to 0.0.2-next.8
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.7 to 0.0.2-next.8

## [0.0.2-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.6...rights-management-service-v0.0.2-next.7) (2025-09-05)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.6 to 0.0.2-next.7
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.6 to 0.0.2-next.7

## [0.0.2-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.5...rights-management-service-v0.0.2-next.6) (2025-09-05)


### Features

* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.5 to 0.0.2-next.6
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.5 to 0.0.2-next.6

## [0.0.2-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.4...rights-management-service-v0.0.2-next.5) (2025-09-05)


### Features

* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.4 to 0.0.2-next.5
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pnp-service bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.4 to 0.0.2-next.5

## [0.0.2-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.3...rights-management-service-v0.0.2-next.4) (2025-08-29)


### Features

* eslint migration to flat config ([5313718](https://github.com/iotaledger/twin-rights-management/commit/5313718f15efb4f6b1f257bf9807770baef7eed3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.3 to 0.0.2-next.4
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.3 to 0.0.2-next.4

## [0.0.2-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.2...rights-management-service-v0.0.2-next.3) (2025-08-29)


### Features

* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.2 to 0.0.2-next.3
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.2 to 0.0.2-next.3

## [0.0.2-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.1...rights-management-service-v0.0.2-next.2) (2025-08-22)


### Features

* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.1 to 0.0.2-next.2
  * devDependencies
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/rights-management-pdp-service bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/rights-management-pep-service bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/rights-management-pip-service bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/rights-management-pmp-service bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/rights-management-pxp-service bumped from 0.0.2-next.1 to 0.0.2-next.2

## [0.0.2-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.2-next.0...rights-management-service-v0.0.2-next.1) (2025-08-20)


### Features

* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* remove unused namespace ([e8aa679](https://github.com/iotaledger/twin-rights-management/commit/e8aa679479231a49f86dd8dec5f9b811bd3f595f))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update twindev schemas ([5d4edc1](https://github.com/iotaledger/twin-rights-management/commit/5d4edc1326fef611619d4b371a5d05a75ada719a))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.2-next.0 to 0.0.2-next.1
    * @twin.org/rights-management-pap-service bumped from 0.0.2-next.0 to 0.0.2-next.1

## 0.0.1 (2025-07-08)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from ^0.0.0 to ^0.0.1
    * @twin.org/rights-management-pap-service bumped from ^0.0.0 to ^0.0.1

## [0.0.1-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.11...rights-management-service-v0.0.1-next.12) (2025-06-26)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.11 to 0.0.1-next.12
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.11 to 0.0.1-next.12

## [0.0.1-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.10...rights-management-service-v0.0.1-next.11) (2025-06-20)


### Bug Fixes

* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.10 to 0.0.1-next.11
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.10 to 0.0.1-next.11

## [0.0.1-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.9...rights-management-service-v0.0.1-next.10) (2025-06-12)


### Features

* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.9 to 0.0.1-next.10
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.9 to 0.0.1-next.10

## [0.0.1-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.8...rights-management-service-v0.0.1-next.9) (2025-06-06)


### Features

* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))


### Bug Fixes

* adding missing dependency ([#15](https://github.com/iotaledger/twin-rights-management/issues/15)) ([c7e6267](https://github.com/iotaledger/twin-rights-management/commit/c7e62678b296ef8d28c31921cb78aeabe674cd84))
* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))
* slimline openapi spec ([aacb9d5](https://github.com/iotaledger/twin-rights-management/commit/aacb9d50f80d3652ef7419ca3777f53e542773f1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.8 to 0.0.1-next.9
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.8 to 0.0.1-next.9

## [0.0.1-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.7...rights-management-service-v0.0.1-next.8) (2025-06-05)


### Features

* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.7 to 0.0.1-next.8
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.7 to 0.0.1-next.8

## [0.0.1-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.6...rights-management-service-v0.0.1-next.7) (2025-06-02)


### Miscellaneous Chores

* **rights-management-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.6 to 0.0.1-next.7
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.6 to 0.0.1-next.7

## [0.0.1-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.5...rights-management-service-v0.0.1-next.6) (2025-05-29)


### Features

* remove unnecessary config options from service ([31ef3a2](https://github.com/iotaledger/twin-rights-management/commit/31ef3a2eb2293efdad7e6b8b55f105cc62bba3ed))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.5 to 0.0.1-next.6
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.5 to 0.0.1-next.6

## [0.0.1-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.4...rights-management-service-v0.0.1-next.5) (2025-05-29)


### Features

* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.4 to 0.0.1-next.5
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.4 to 0.0.1-next.5

## [0.0.1-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.3...rights-management-service-v0.0.1-next.4) (2025-05-28)


### Bug Fixes

* modifying the function name for the rest routes ([#6](https://github.com/iotaledger/twin-rights-management/issues/6)) ([7915111](https://github.com/iotaledger/twin-rights-management/commit/7915111ac608c9d69bcaa819c85b553fc9bace6a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.3 to 0.0.1-next.4
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.3 to 0.0.1-next.4

## [0.0.1-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-service-v0.0.1-next.2...rights-management-service-v0.0.1-next.3) (2025-05-28)


### Features

* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/rights-management-models bumped from 0.0.1-next.2 to 0.0.1-next.3
    * @twin.org/rights-management-pap-service bumped from 0.0.1-next.2 to 0.0.1-next.3

## 0.0.1-next.1

- Initial release.
