# Reproducing the useful parts

## 1. Run the local model benchmark

Requirements: an Apple Silicon Mac, a compatible macOS release, network access, free disk space for Python/dependencies and roughly 1 GB of model files, and [uv](https://docs.astral.sh/uv/). This script only benchmarks a local model. It does not connect a miner to FLOP.

Choose a working directory on the disk you want to use. The script keeps Python, caches, temporary files and model downloads there.

```sh
FLOP_WORK_DIR="/absolute/path/to/your/work-directory" sh scripts/benchmark-local.sh
```

The script pins the checkpoint revision, runs the same short prompt and limits generation to 128 tokens. It uses the observed Python package versions. The returned tokens/s and peak memory are local model measurements. Other apps, thermals, prompt length and software affect the result. One prompt is not a sustained workload study.

The benchmark's Hugging Face snapshot can contain symlinks. It is **not** a ready-to-register FLOP model package.

## 2. Understand the devnet workflow

The following describes the completed experiment, not a one-command installer. The account-bound signing scripts, credentials and tunnel configuration are intentionally absent from this repository.

1. Read the [current operator guide](https://docs.flop.network/docs/run-operator) and [miner guide](https://docs.flop.network/docs/run-miner). Obtain the current release and verify the correct devnet genesis. The historical genesis and software used in this test are in the evidence record.
2. Prepare your own protected miner identity and independent session/Ghost keys. Keep keys in local files with restrictive permissions. Do not reuse this experiment's public account or someone else's configuration.
3. Obtain the upstream worker through the published, digest-pinned release. In this experiment its JavaScript ran natively on macOS. Review the runtime and host assumptions; the regular NVIDIA/CUDA backend does not become an Apple GPU backend merely by using Docker.
4. Download **every file** of the exact registered checkpoint into a regular-file directory. Let the upstream worker calculate the model root and compare it with the registry. Resolve mismatches; do not turn the gate off.
5. Run the pinned BF16 model locally with MLX. Bind it to loopback. Implement and review the worker/backend interface, native token usage, model aliases and exact decode-policy behavior. A generic OpenAI-compatible endpoint alone does not establish FLOP compatibility. This test used a small custom legacy-v1 bridge; its private operational version is not a supported public backend release.
6. Check current sponsorship availability before requesting registration. Confirm registration, stake and fee funds from finalized chain state. A successful-looking HTTP reply is insufficient: the retired account in our first check received a cached historical sponsor response.
7. If participating in calibration, keep the worker available to answer its assigned jobs. Wait for accepted calibration and check the runtime's accepted cap. Our custom, conservative acceptance used real finalized reference jobs and unchanged runtime validation. Do not copy the number 100 as a measurement of your device.
8. Establish an authenticated session endpoint and validate its identity. Expose only that endpoint through your chosen TLS/tunnel arrangement, keeping the model server private.
9. Authorize a bounded test with your own agent. Ours used at most 1 test FLOP escrow and 8 completion tokens per attempt. Transaction fees are separate. Inspect pending/open channels before any retry; the first failed test here had to close and refund before the corrected attempt.
10. Verify the response and receipt, then the finalized settlement transaction and matching event. Distinguish your own self-test from third-party work and reward eligibility.
11. Drain/close channels and disputes before retiring the miner. Check finalized deregistration and stop local services. Stopping a process alone does not retire a registered miner.

For testnet, repeat the release, identity, proof-support and eligibility checks with the actual testnet inputs. These historical devnet instructions do not configure a future network.

## 3. Verify the published experiment

```sh
npm ci --ignore-scripts
npm run verify
```

This uses public evidence and a public RPC only. There are no transaction-signing commands in the repository. The implementation checks events belonging to the exact transaction index, not unrelated events from the same block.
