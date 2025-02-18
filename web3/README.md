# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

<!-- Black Token -->
Black token Address: 0x509c9829A348CFbdb3EfC0fda46EDE976B12a069
https://scan-testnet.assetchain.org/address/0x509c9829A348CFbdb3EfC0fda46EDE976B12a069#code

<!-- USD Token -->
USDT token Address: 0x0796a31ab84d80d1535300d6Ffb4420A0AB7B83a
https://scan-testnet.assetchain.org/address/0x0796a31ab84d80d1535300d6Ffb4420A0AB7B83a#code

USDT/BLACK Pool Address: 0x19F1c4e6E26C4Fd0d62E2701c817551dde66A289

LiquidityPoolCreatorModule#LiquidityPoolCreator - 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0

npx hardhat verify --network assetchain 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0  --constructor-args ./args/args-pool-creator.ts