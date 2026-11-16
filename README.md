# FLOP on a Mac mini M4

Devnet experiment notes, recorded on **16 November 2026**. [Türkçe](README.tr.md)

I ran an AI-assisted FLOP devnet test on my **Mac mini M4, 24 GB unified memory**. Qwen2.5-0.5B-Instruct ran locally through MLX, a client verified the signed response, and the devnet finalized a **0.99 test FLOP** payment to the miner.

The agent and miner were both mine. This was a functional self-test. **It does not establish external earnings, testnet reward eligibility, or mainnet compatibility.** The tested path was legacy SOFT with **TOPLOC disabled**.

## Results

| Measurement | Observed result | Scope |
|---|---:|---|
| Local generation | 61.678 and 85.828 tokens/s | Two separate short runs, 128 generated tokens each |
| MLX peak memory | 1.057 GB | Model benchmark; excludes the rest of macOS |
| Accepted devnet capacity | 100 GFLOP/s | A deliberately conservative protocol capacity, not an independent GPU benchmark |
| Completed reference tasks | 72/72 | No expired or incorrect tasks in the recorded check |
| Paid test request | 8 completion tokens, 41 G_n | One cooperative settlement |
| Miner payment | 0.99 test FLOP | Self-payment; test tokens have no monetary value |
| Additional GPU rental | $0 | Existing Mac; electricity and hardware costs excluded |

The original run produced 85.828 tokens/s; a rerun while preparing this repository produced 61.678 tokens/s. These are two short observations, not a sustained performance estimate.

The model was **Qwen/Qwen2.5-0.5B-Instruct, BF16**, revision `7ae557604adf67be50417f59c2c2f167def9a775`. This result applies to that small model and configuration. The 24 GB is shared system memory, not dedicated VRAM.

## Check the evidence

The [public evidence record](evidence/devnet-test.json) contains public devnet identifiers and selected results. It contains no wallet secrets, bearer tokens, private configuration, or raw machine logs.

- Settlement: [`0x21a23f…ce6fea0`](evidence/devnet-test.json), block **3,852,620**.
- Miner: [`5CeorJ…1A193U`](https://explorer.devnet.flop.network/api/miners/5CeorJnvyF5sgjpk2AMAnutGXMCUsuXuNvpJjbqvD31A193U).
- The miner was deregistered and local services were stopped after the test. Sponsor stake belongs to its sponsor.

The verifier reads public RPC data. It checks the genesis, historical block and transaction, the matching finalized settlement, calibration, refund, and retirement. **It does not load a wallet, sign, fund, register, or rent anything.**

```sh
npm ci --ignore-scripts
npm run verify
```

Node 22 is recommended. The default endpoint is `https://rpc.devnet.flop.network`; an alternative archive RPC can be supplied with `FLOP_RPC`. Historical data availability is required. A network error means verification is unavailable, not that the experiment was disproved. This is RPC-based verification, not a light-client proof.

## Reproduce and learn from it

- [Local benchmark and devnet walkthrough](docs/reproduction.md)
- [Components, exact versions, fixes and limitations](docs/experiment.md)
- [Publication privacy notes](docs/privacy.md)

This repository is a case study with a runnable local benchmark and a read-only evidence verifier. It is **not a complete miner installer**. The private operational scripts were bound to my accounts and were not published. A new devnet setup needs its own current release, credentials, registration, calibration and authorized transaction limits.

## What remains open

Apple GPU TOPLOC capture, testnet acceptance, reward eligibility, larger models, sustained throughput, outside demand and profitability were not established. A successful legacy devnet settlement cannot answer those questions. Recheck the release and network rules before spending money or leaving a miner running.

## References

- [Official FLOP miner guide](https://docs.flop.network/docs/run-miner)
- [Official release manifest](https://flop.network/releases.json)
- [Apple Silicon / MLX discussion](https://github.com/flop-labs/network/issues/268)
- [UfukNode's NVIDIA miner guide](https://github.com/UfukNode/flop-miner-setup), useful context for the worker and devnet operation; it is not a Mac GPU guide.
- [MLX LM](https://github.com/ml-explore/mlx-lm)

These notes are independent community work by [Grimm](https://github.com/0xGr1mm), with AI assistance. No affiliation with FLOP Labs is implied. Upstream software and model weights retain their own licenses.
