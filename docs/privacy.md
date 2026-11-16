# Publication scope

This is a fresh repository assembled from an explicit file list. It is not an upload of the working directory or the handoff backup.

Included:

- Device class, software versions, model revision and registered model root.
- Selected measurements with their limits.
- Public devnet miner, channel, transaction and block identifiers needed to check the result.
- A local benchmark script and a read-only public-chain verifier.

Excluded:

- Seed phrases, signer files, secret keys, keystores and session/Ghost private keys.
- Bearer/API tokens, passwords, credential files and environment dumps.
- Raw logs, backups, screenshots, personal email, serial numbers, device identifiers and local user paths.
- Temporary tunnel names, private service configuration, account-bound signing/funding scripts, model weights and worker/container binaries.

Public blockchain identifiers can link activity on the devnet. They are deliberately included for auditability; they are not anonymized. The verifier requires no secrets. Use a public or otherwise trusted RPC, since requests reveal which public records you are checking.

The initial commit uses the GitHub account's noreply address rather than a personal email. New files should receive the same content and staged-diff review before publication. `.gitignore` is a secondary safeguard, not a secret scanner.
