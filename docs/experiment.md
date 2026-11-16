# What was actually tested

## Components

```text
existing agent → public FLOP devnet channel
                   ↓
              miner worker (native Node)
                   ↓ loopback, authenticated
              local policy bridge
                   ↓ loopback
              MLX LM → Apple M4 GPU
```

The registered checkpoint was Qwen2.5-0.5B-Instruct BF16. The worker measured the complete local package against the registered root. MLX loaded the same pinned checkpoint. The bridge accepted the declared model slug, used the canonical backend model name, enforced the pinned sampling policy, and returned MLX's native token counts and stop reason. It rejected TOPLOC and structured-v2 capture requests rather than inventing evidence.

The worker's JavaScript came from a verified public image application layer. CUDA and the Linux backend were not run on macOS. A small native launcher loaded local configuration and restricted the session listener to loopback. A temporary HTTPS tunnel exposed the session endpoint; the model server stayed local.

The original worker bundle, upstream backend sources, models, binaries and private operational files are not redistributed here. Use the upstream licenses and current release instructions for those artifacts.

## Observed versions

| Component | Version |
|---|---|
| Node | 22.22.3 |
| Python | 3.11.15 |
| MLX / MLX LM | 0.32.4 / 0.32.2 |
| FLOP worker | 0.1.336 |
| FLOP SDK client | 0.5.1 |
| Devnet runtime | 1014020 |

The observed Python environment is in [requirements-observed.txt](../requirements-observed.txt). It is a historical freeze, not a promise of compatibility with future releases.

Worker image:

```text
ghcr.io/flop-labs/flop-core/miner-worker:v0.1.336@sha256:b238975bb6ca282358e8f52f178152f26b4675ae6bbc5e1e305eacf92b27e39d
```

Application-layer digest:

```text
sha256:9e1e2f7151fa73bcf44d0774acf14486447f8e20985e22fe56229230b0d67e90
```

Unmodified worker bundle SHA-256:

```text
33255f3fd456f6f1a3e0c1c22221654d54e0117a3108c2012f240cb9c644bc0d
```

These identify the experiment. Recheck support before running an old release.

## Things that needed attention

1. **A working model cache is not a registered model package.** The initial Hugging Face cache used symlinks and omitted repository files. FLOP rejected it. Materializing every file at the pinned revision produced the registered root. The model gate stayed enabled.
2. **Calibration needed a lower capacity request.** The automatic 176 GFLOP/s request failed with `InsufficientBurstWork`. We reread the finalized reference jobs, selected the newest 64, retained their actual work and issue blocks, and requested at most 100 with an extra 180-block timing margin. The runtime accepted it. This does not measure the M4's independent physical throughput.
3. **Automatic channel discovery was slow.** The worker scans channels for pending acknowledgements. For these two owned test channels, a targeted operator `forceAck` used the worker's actual session public key after checking identity, budget, deadline, signer state and pending transactions. No runtime checks were removed.
4. **Model-name casing mattered in the bridge.** The first request used the lowercase registry slug and was rejected by an uppercase-only check. The failed channel timed out and refunded its 1 test FLOP escrow. The bridge was fixed and locally checked with the same lowercase, streaming request. A second devnet attempt began only after the first channel was closed.
5. **Uncertain settlement needs reconciliation.** The client used SDK 0.5.1 with a local guard that treated an uncertain cooperative-close exception as an unknown outcome, rather than immediately submitting another close. The successful settlement was then checked independently against finalized block events.

## Interpretation

The successful request returned “Hello! How can I assist you today”, with 8 completion tokens and 41 G_n. Its signed response and checkpoint were accepted; a cooperative settlement paid 0.99 test FLOP.

SOFT hardware calibration and TOPLOC capture are separate matters. TOPLOC was disabled here. The devnet's reference/simulator tasks and accepted capacity must not be presented as an independently measured Apple GPU benchmark. A completed devnet self-payment also says nothing about outside demand or whether this path will qualify for testnet rewards.

Both test channels were closed. The miner was deregistered, sponsor unbonding began, and the local worker, model server, bridge and tunnel were stopped. No automatic startup was installed.
