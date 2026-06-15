# Changelog

## Unreleased

### ⚠ BREAKING CHANGES

* remove EcosystemPolicy models/DTOs and standardize policy typing on `OdrlPolicyType` for v2.

## [0.0.3-next.50](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.49...rights-management-models-v0.0.3-next.50) (2026-06-15)


### Features

* simplify pnap create request ([be4dfe7](https://github.com/iotaledger/twin-rights-management/commit/be4dfe726a0bc7af11eb05cfd0525e7bff8a7d98))

## [0.0.3-next.49](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.48...rights-management-models-v0.0.3-next.49) (2026-06-15)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.48](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.47...rights-management-models-v0.0.3-next.48) (2026-06-15)


### Features

* add create() to pre-register consumer-side contract negotiations ([#187](https://github.com/iotaledger/twin-rights-management/issues/187)) ([6007f83](https://github.com/iotaledger/twin-rights-management/commit/6007f83579cc8d4dbc4c2243fed0cbe948371f82))

## [0.0.3-next.47](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.46...rights-management-models-v0.0.3-next.47) (2026-06-12)


### Features

* add PAP-managed schema.org lifecycle timestamps to policies ([#176](https://github.com/iotaledger/twin-rights-management/issues/176)) ([8d53036](https://github.com/iotaledger/twin-rights-management/commit/8d5303674b93a59532c0f16864b8484378ebe16c))

## [0.0.3-next.46](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.45...rights-management-models-v0.0.3-next.46) (2026-06-11)


### Features

* organization identifiers ([#177](https://github.com/iotaledger/twin-rights-management/issues/177)) ([98d2484](https://github.com/iotaledger/twin-rights-management/commit/98d24841e3ecbb9a5225c151d171f8a9c08ccfbc))

## [0.0.3-next.45](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.44...rights-management-models-v0.0.3-next.45) (2026-06-05)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.3-next.44](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.43...rights-management-models-v0.0.3-next.44) (2026-06-05)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.43](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.42...rights-management-models-v0.0.3-next.43) (2026-06-04)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.42](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.41...rights-management-models-v0.0.3-next.42) (2026-06-04)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.41](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.40...rights-management-models-v0.0.3-next.41) (2026-06-03)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.40](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.39...rights-management-models-v0.0.3-next.40) (2026-06-03)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.39](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.38...rights-management-models-v0.0.3-next.39) (2026-06-02)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.38](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.37...rights-management-models-v0.0.3-next.38) (2026-06-02)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.37](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.36...rights-management-models-v0.0.3-next.37) (2026-05-26)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* adopt node/tenant identifier model in PNP + IPolicyNegotiation ([#145](https://github.com/iotaledger/twin-rights-management/issues/145)) ([0911bfc](https://github.com/iotaledger/twin-rights-management/commit/0911bfc6b59d1067958cb3a70d2fae823c9f2359))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.3-next.36](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.35...rights-management-models-v0.0.3-next.36) (2026-05-20)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.3-next.35](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.34...rights-management-models-v0.0.3-next.35) (2026-05-20)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))
* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dependencies ([5bfbb30](https://github.com/iotaledger/twin-rights-management/commit/5bfbb302bb245c8cd8015ff497db3793077d43cd))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))
* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.3-next.34](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.33...rights-management-models-v0.0.3-next.34) (2026-05-13)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.33](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.32...rights-management-models-v0.0.3-next.33) (2026-05-11)


### Features

* typescript 6 update ([18f6f1e](https://github.com/iotaledger/twin-rights-management/commit/18f6f1edba890462c068ba0b76ae6dd005e798be))

## [0.0.3-next.32](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.31...rights-management-models-v0.0.3-next.32) (2026-05-05)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.31](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.30...rights-management-models-v0.0.3-next.31) (2026-05-01)


### Features

* pnp callback encryption, getDatasetTargets helper, engine-driven callbackPath ([#132](https://github.com/iotaledger/twin-rights-management/issues/132)) ([e642154](https://github.com/iotaledger/twin-rights-management/commit/e6421546336bfa73a7c0a9fe102beeaa518249dd))

## [0.0.3-next.30](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.29...rights-management-models-v0.0.3-next.30) (2026-04-29)


### Features

* add canonical twin:jsonPath operand support with legacy compatibility ([#126](https://github.com/iotaledger/twin-rights-management/issues/126)) ([3ab8078](https://github.com/iotaledger/twin-rights-management/commit/3ab8078cacc47a09202e73d66d788276ae218025))

## [0.0.3-next.29](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.28...rights-management-models-v0.0.3-next.29) (2026-04-10)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.28](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.27...rights-management-models-v0.0.3-next.28) (2026-04-09)


### Features

* add EcosystemPolicy typed getter across PAP stack ([#114](https://github.com/iotaledger/twin-rights-management/issues/114)) ([2a8e941](https://github.com/iotaledger/twin-rights-management/commit/2a8e941bbea229fb74f81dc869ce1f85c66c300d))

## [0.0.3-next.27](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.26...rights-management-models-v0.0.3-next.27) (2026-03-31)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.26](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.25...rights-management-models-v0.0.3-next.26) (2026-03-27)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.25](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.24...rights-management-models-v0.0.3-next.25) (2026-03-20)


### Features

* update standards packages ([db0740b](https://github.com/iotaledger/twin-rights-management/commit/db0740b1d8925fcb3bf4204641e0dc573af40f2b))

## [0.0.3-next.24](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.23...rights-management-models-v0.0.3-next.24) (2026-03-17)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.23](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.22...rights-management-models-v0.0.3-next.23) (2026-03-13)


### Bug Fixes

* resolve 5 bugs preventing PNP contract negotiation callbacks ([#98](https://github.com/iotaledger/twin-rights-management/issues/98)) ([4a065d6](https://github.com/iotaledger/twin-rights-management/commit/4a065d669440f47dc44c3602abe7efa1ea9d45ff))

## [0.0.3-next.22](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.21...rights-management-models-v0.0.3-next.22) (2026-03-09)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.21](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.20...rights-management-models-v0.0.3-next.21) (2026-03-06)


### Features

* update to more specific ds odrl types ([c56dc49](https://github.com/iotaledger/twin-rights-management/commit/c56dc4991d4e1e8ca3beb737d2a70dddf6f5cd44))

## [0.0.3-next.20](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.19...rights-management-models-v0.0.3-next.20) (2026-02-27)


### Features

* capture organization identity ([#88](https://github.com/iotaledger/twin-rights-management/issues/88)) ([8fcee6e](https://github.com/iotaledger/twin-rights-management/commit/8fcee6e676bb5a9a344d83c50567066e447aca76))

## [0.0.3-next.19](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.18...rights-management-models-v0.0.3-next.19) (2026-02-26)


### Features

* implementing the schedule cleanup ([#85](https://github.com/iotaledger/twin-rights-management/issues/85)) ([cf44bc7](https://github.com/iotaledger/twin-rights-management/commit/cf44bc79c0df9a0a1e60e35849bd46253ce5c8bf))

## [0.0.3-next.18](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.17...rights-management-models-v0.0.3-next.18) (2026-02-26)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.17](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.16...rights-management-models-v0.0.3-next.17) (2026-02-25)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))
* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))
* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))
* consistent uid usage ([#83](https://github.com/iotaledger/twin-rights-management/issues/83)) ([bdfb9f9](https://github.com/iotaledger/twin-rights-management/commit/bdfb9f92777cbfdb65b5b7df5660b70d869ed19d))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.3-next.16](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.15...rights-management-models-v0.0.3-next.16) (2026-02-24)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.15](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.14...rights-management-models-v0.0.3-next.15) (2026-02-12)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.13...rights-management-models-v0.0.3-next.14) (2026-02-12)


### Features

* add default policy arbiter ([#76](https://github.com/iotaledger/twin-rights-management/issues/76)) ([b62ff9c](https://github.com/iotaledger/twin-rights-management/commit/b62ff9ce1b3400c4a95909da01863af47f430dbf))
* policy negotiator callback ([#77](https://github.com/iotaledger/twin-rights-management/issues/77)) ([6566ed0](https://github.com/iotaledger/twin-rights-management/commit/6566ed0e2186b6445f1669f9b2f88a6ce059ab83))

## [0.0.3-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.12...rights-management-models-v0.0.3-next.13) (2026-02-02)


### Features

* add default enforcement processor ([#73](https://github.com/iotaledger/twin-rights-management/issues/73)) ([0c64d49](https://github.com/iotaledger/twin-rights-management/commit/0c64d49bab363b3da6d197536a605f7929a7c584))

## [0.0.3-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.11...rights-management-models-v0.0.3-next.12) (2026-02-02)


### Features

* additional pap features ([66cc2db](https://github.com/iotaledger/twin-rights-management/commit/66cc2db71facab2572f55d540dd71398c174d480))
* update processors ([#71](https://github.com/iotaledger/twin-rights-management/issues/71)) ([d6e8c1e](https://github.com/iotaledger/twin-rights-management/commit/d6e8c1e593acb28556674d5180123f220766eb6b))

## [0.0.3-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.10...rights-management-models-v0.0.3-next.11) (2026-01-29)


### Features

* additional pap features ([50e60e6](https://github.com/iotaledger/twin-rights-management/commit/50e60e68c2c86a020fef3edc71b16bad85a9f87c))
* additional pap features ([#69](https://github.com/iotaledger/twin-rights-management/issues/69)) ([a80d511](https://github.com/iotaledger/twin-rights-management/commit/a80d511ace8fad9fbf4c02cb82ead261a5944b34))

## [0.0.3-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.9...rights-management-models-v0.0.3-next.10) (2026-01-28)


### Features

* remove data access point ([#67](https://github.com/iotaledger/twin-rights-management/issues/67)) ([8573676](https://github.com/iotaledger/twin-rights-management/commit/8573676862c9f1634a66a0677b225b4de16a89cd))

## [0.0.3-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.8...rights-management-models-v0.0.3-next.9) (2026-01-26)


### Features

* change callback url to callback path ([#65](https://github.com/iotaledger/twin-rights-management/issues/65)) ([f02ceaf](https://github.com/iotaledger/twin-rights-management/commit/f02ceaf0a53083f088690c7d3a384045b1061821))

## [0.0.3-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.7...rights-management-models-v0.0.3-next.8) (2026-01-21)


### Features

* update contexts ([#63](https://github.com/iotaledger/twin-rights-management/issues/63)) ([e55200f](https://github.com/iotaledger/twin-rights-management/commit/e55200f9929eaced6c446be25969dbe0f95ee909))

## [0.0.3-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.6...rights-management-models-v0.0.3-next.7) (2026-01-14)


### Features

* update namespaces and contexts ([#61](https://github.com/iotaledger/twin-rights-management/issues/61)) ([033446b](https://github.com/iotaledger/twin-rights-management/commit/033446b91ccf0c7664061afda9a1ad49d3c671ec))

## [0.0.3-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.5...rights-management-models-v0.0.3-next.6) (2026-01-12)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.4...rights-management-models-v0.0.3-next.5) (2026-01-06)


### Features

* update dspace dependencies ([072917b](https://github.com/iotaledger/twin-rights-management/commit/072917bcfa052a6d61e6cd3676e275ba7fc4ec25))

## [0.0.3-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.3...rights-management-models-v0.0.3-next.4) (2025-12-04)


### Features

* add factory pattern ([d26b4c0](https://github.com/iotaledger/twin-rights-management/commit/d26b4c08a2f3ba5758df66a1c48203b8d8e3638e))

## [0.0.3-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.2...rights-management-models-v0.0.3-next.3) (2025-11-28)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.1...rights-management-models-v0.0.3-next.2) (2025-11-20)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.3-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.3-next.0...rights-management-models-v0.0.3-next.1) (2025-11-11)


### Features

* add context id features ([#51](https://github.com/iotaledger/twin-rights-management/issues/51)) ([239922c](https://github.com/iotaledger/twin-rights-management/commit/239922c82a7fa94b66c8ee0e924bc58ddaaba395))
* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))
* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))
* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))
* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))
* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.2-next.14](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.13...rights-management-models-v0.0.2-next.14) (2025-10-09)


### Features

* add validate-locales ([78f30cf](https://github.com/iotaledger/twin-rights-management/commit/78f30cf61054655c815e5fc42972ee39502e3687))

## [0.0.2-next.13](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.12...rights-management-models-v0.0.2-next.13) (2025-09-23)


### Features

* update to use built in vc authentication ([f982b86](https://github.com/iotaledger/twin-rights-management/commit/f982b8676a7d21add85195c73558ef4f0fd9be29))

## [0.0.2-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.11...rights-management-models-v0.0.2-next.12) (2025-09-22)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.2-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.10...rights-management-models-v0.0.2-next.11) (2025-09-19)


### Features

* engine compatibility updates ([490e015](https://github.com/iotaledger/twin-rights-management/commit/490e015901d6a5ac6563da484a18fc5f285556b1))

## [0.0.2-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.9...rights-management-models-v0.0.2-next.10) (2025-09-19)


### Features

* add DAP (Data Access Point) ([#40](https://github.com/iotaledger/twin-rights-management/issues/40)) ([f3e684b](https://github.com/iotaledger/twin-rights-management/commit/f3e684ba1f9a934394c64635f393fbb6709ff480))
* add policy management point PMP ([#38](https://github.com/iotaledger/twin-rights-management/issues/38)) ([f7b55f7](https://github.com/iotaledger/twin-rights-management/commit/f7b55f728336a0cacb1aa0ed7866242962915d0e))
* international dataspaces contract negotiation ([#41](https://github.com/iotaledger/twin-rights-management/issues/41)) ([41ed515](https://github.com/iotaledger/twin-rights-management/commit/41ed5154d6cef48bc99db3158dbde6ec88523a0b))
* move create and verify proofs to helper ([a4e1f4a](https://github.com/iotaledger/twin-rights-management/commit/a4e1f4afe01ea12c36f29672197128e65819c875))
* pdp add ([#39](https://github.com/iotaledger/twin-rights-management/issues/39)) ([68b9a8a](https://github.com/iotaledger/twin-rights-management/commit/68b9a8a7a3cf2902f9eecb590ca3316c6b1671f0))
* refactor models structure ([a19faba](https://github.com/iotaledger/twin-rights-management/commit/a19faba2580d65a9348ae7107e3e930ec37ce48f))
* update generated schema external references ([7069a5f](https://github.com/iotaledger/twin-rights-management/commit/7069a5fa517cc1161773a727131a91a79432e26c))
* update generated schema external references ([8df169f](https://github.com/iotaledger/twin-rights-management/commit/8df169f7008abfd572d866f228f260344bf01a78))


### Bug Fixes

* typos ([a969249](https://github.com/iotaledger/twin-rights-management/commit/a969249cc3c8d9680880be4379a4bb546c48e935))

## [0.0.2-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.8...rights-management-models-v0.0.2-next.9) (2025-09-08)


### Features

* add JSON-LD types for negotiation ([6be61f8](https://github.com/iotaledger/twin-rights-management/commit/6be61f890537cb9d22d4fad90092b858de2c9c2d))

## [0.0.2-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.7...rights-management-models-v0.0.2-next.8) (2025-09-05)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.2-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.6...rights-management-models-v0.0.2-next.7) (2025-09-05)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.2-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.5...rights-management-models-v0.0.2-next.6) (2025-09-05)


### Features

* separate rest routes ([538b86b](https://github.com/iotaledger/twin-rights-management/commit/538b86be26b46711279101aa01fec119419d8149))

## [0.0.2-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.4...rights-management-models-v0.0.2-next.5) (2025-09-05)


### Features

* add PEP ([#31](https://github.com/iotaledger/twin-rights-management/issues/31)) ([34c7c29](https://github.com/iotaledger/twin-rights-management/commit/34c7c2965e5c0c2be24460628f83cdae0aa7f0d6))
* add PIP static source ([#30](https://github.com/iotaledger/twin-rights-management/issues/30)) ([ace4150](https://github.com/iotaledger/twin-rights-management/commit/ace4150df9b529b03e8a3d66a0ce4cbc35744bc4))
* add policy negotiation point PNP, PNAP and PNRP ([#32](https://github.com/iotaledger/twin-rights-management/issues/32)) ([90f0659](https://github.com/iotaledger/twin-rights-management/commit/90f06593a1126df3c2f4ca23cf95a08260fd6415))
* introduce context for additional environment input ([e1d0392](https://github.com/iotaledger/twin-rights-management/commit/e1d0392622e5a018b695644f423c5b23cc40d3b7))
* remove element factories ([8cb4af8](https://github.com/iotaledger/twin-rights-management/commit/8cb4af85a5c9c01e3b68ecc7109cf701b914ea9a))

## [0.0.2-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.3...rights-management-models-v0.0.2-next.4) (2025-08-29)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.2-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.2...rights-management-models-v0.0.2-next.3) (2025-08-29)


### Features

* add policy information point ([#27](https://github.com/iotaledger/twin-rights-management/issues/27)) ([61a1cd1](https://github.com/iotaledger/twin-rights-management/commit/61a1cd18f0c2c4a847c0a30da70de6814c777e29))
* eslint migration to flat config ([23a0c08](https://github.com/iotaledger/twin-rights-management/commit/23a0c085e7fc2e522c8d85d325dc5844b9c3fd8e))
* policy execution point ([#26](https://github.com/iotaledger/twin-rights-management/issues/26)) ([d930f10](https://github.com/iotaledger/twin-rights-management/commit/d930f104006a0d815cdf222b87d11d749351fb84))
* switch execution callback to class/factory pattern ([60db8cf](https://github.com/iotaledger/twin-rights-management/commit/60db8cfa213d7d4432396b196442d592a5dab6a6))
* switch execution callback to class/factory pattern ([a6b5660](https://github.com/iotaledger/twin-rights-management/commit/a6b56602aad98652de06961c436c76d52bf42665))
* switch execution callback to class/factory pattern ([8294daf](https://github.com/iotaledger/twin-rights-management/commit/8294daf933b74a1f90f1a34f206b215e59d76810))

## [0.0.2-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.1...rights-management-models-v0.0.2-next.2) (2025-08-22)


### Features

* add scaffold for other services ([de25f34](https://github.com/iotaledger/twin-rights-management/commit/de25f34c40fb65b6d73df98965ea4e368019da84))

## [0.0.2-next.1](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.2-next.0...rights-management-models-v0.0.2-next.1) (2025-08-20)


### Features

* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))
* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))
* update framework core ([d0ffcba](https://github.com/iotaledger/twin-rights-management/commit/d0ffcba9cf1dc2b562193ee298f099612d100ce8))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))
* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))

## 0.0.1 (2025-07-08)


### Features

* release to production ([947f85a](https://github.com/iotaledger/twin-rights-management/commit/947f85ab9e23c117135dba7008a75c2d85435259))

## [0.0.1-next.12](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.11...rights-management-models-v0.0.1-next.12) (2025-06-26)


### Features

* add policy decision stage ([b3eb5a9](https://github.com/iotaledger/twin-rights-management/commit/b3eb5a96f6270247d198b57c07deca4eeb5cc0bb))


### Bug Fixes

* correct PXP naming in comments ([1cd9053](https://github.com/iotaledger/twin-rights-management/commit/1cd9053eaa1c56a53d3cc52e75ea4d242bbe2654))

## [0.0.1-next.11](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.10...rights-management-models-v0.0.1-next.11) (2025-06-20)


### Bug Fixes

* query params force coercion ([8590a0d](https://github.com/iotaledger/twin-rights-management/commit/8590a0da92584c04b67e73c448319f96f70c34a5))

## [0.0.1-next.10](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.9...rights-management-models-v0.0.1-next.10) (2025-06-12)


### Features

* update dependencies ([dd0a553](https://github.com/iotaledger/twin-rights-management/commit/dd0a553020b0dc5c41fb6865a2e36bd26045b0b9))

## [0.0.1-next.9](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.8...rights-management-models-v0.0.1-next.9) (2025-06-06)


### Features

* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))
* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))

## [0.0.1-next.8](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.7...rights-management-models-v0.0.1-next.8) (2025-06-05)


### Features

* pap create, update methods ([#13](https://github.com/iotaledger/twin-rights-management/issues/13)) ([edb6c9e](https://github.com/iotaledger/twin-rights-management/commit/edb6c9efcfda55ac96f7594253bf831b4f0e5993))

## [0.0.1-next.7](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.6...rights-management-models-v0.0.1-next.7) (2025-06-02)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.1-next.6](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.5...rights-management-models-v0.0.1-next.6) (2025-05-29)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.1-next.5](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.4...rights-management-models-v0.0.1-next.5) (2025-05-29)


### Features

* rename pap entity storage to pap service ([38a2c14](https://github.com/iotaledger/twin-rights-management/commit/38a2c14d8f63a86e398820166c83437be5aca1b8))

## [0.0.1-next.4](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.3...rights-management-models-v0.0.1-next.4) (2025-05-28)


### Miscellaneous Chores

* **rights-management-models:** Synchronize repo versions

## [0.0.1-next.3](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.2...rights-management-models-v0.0.1-next.3) (2025-05-28)


### Features

* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* rights management pap ([#4](https://github.com/iotaledger/twin-rights-management/issues/4)) ([d1165a9](https://github.com/iotaledger/twin-rights-management/commit/d1165a92f57128731cfb308d977832e28cf33493))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))

## [0.0.1-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.1...rights-management-models-v0.0.1-next.2) (2025-04-17)


### Features

* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))
* update models based on feedback ([1f11df3](https://github.com/iotaledger/twin-rights-management/commit/1f11df32bdae5e0a9119e3eee9346b970c5fd345))
* use shared store mechanism ([#2](https://github.com/iotaledger/twin-rights-management/issues/2)) ([21c086d](https://github.com/iotaledger/twin-rights-management/commit/21c086d7be3989858ee28bedb7a1e7b97d65b752))

## [0.0.1-next.2](https://github.com/iotaledger/twin-rights-management/compare/rights-management-models-v0.0.1-next.1...rights-management-models-v0.0.1-next.2) (2025-03-28)


### Features

* add publish workflows ([9f4db27](https://github.com/iotaledger/twin-rights-management/commit/9f4db27cccc724a5061f944b29ed7ed5317c9bbf))

## v0.0.1-next.1

- Initial Release
