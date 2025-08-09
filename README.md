# `rand_generator`
Generate 3k numbers within 50k on IC.

Welcome to your new `rand_generator` project and to the Internet Computer development community. 

![Screenshot](images/rand_generator.png)

To learn more before you start working with `rand_generator`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd rand_generator/
dfx start --background
npm install
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you want to tear down your project, run the following commands:

```bash
dfx canister delete --all
dfx stop
```
