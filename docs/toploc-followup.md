# Mac M4: same-pass TOPLOC follow-up

On 16 November 2026, I extended the earlier legacy SOFT experiment with an experimental MLX backend that captures the model's real final-norm activation in the same forward pass. My own agent verified a V3 receipt, the activation and transcript reached sovereign DA, and a cooperative settlement paid **0.99 test FLOP** in finalized block **3904228**.

This was an operator-assisted self-test between my accounts. It establishes a particular devnet path, not outside demand, official Apple hardware approval, testnet credit, or mainnet compatibility. Independent validator model reexecution was not established.

## Evidence

The [selected public record](../evidence/toploc-followup.json) includes both attempts and their transaction identifiers.

- Successful channel: `0x2d2466ad2889bbc9a3596072ccf08f7108367259772425a278d1216f9ded84a2`
- Settlement: `0x40c8fa08ff7bb11bf132fc9056851ba86a85085beb3c5bac62fbf614b92c1189`
- V3 receipt: 34 prompt tokens, 8 completion tokens, 41 GN; native token-ID and TOPLOC commitments were signed.
- Same-pass final-norm capture: BF16 Qwen2.5-0.5B-Instruct, using the same registered root and pinned checkpoint as the earlier case.
- Reference calibration: 72/72 jobs resolved; 64 real reference jobs supported a conservative accepted cap of 100 GFLOP/s. This is protocol capacity, not 100 earned tokens or an independent physical GPU benchmark.
- The TOPLOC root was checked in canonical state immediately before settlement; the active marker was cleared after the successful close. Both activation and transcript were independently retrieved from the assigned DA providers and matched their canonical bytes, BLAKE2-256 commitments and SHA-256 hashes.

## What changed

The model ran natively through MLX on the existing Mac mini M4, 24 GB unified memory. The unmodified worker bundle came from official release 0.1.358 and ran under native Node 24. The official Linux amd64 DA helper ran in a local Lima VM through Rosetta. No additional GPU or cloud server was rented.

The first full-proof attempt published its evidence but settlement was rejected with `AttestationStale`: slow RPC/DA processing exceeded the 600-block channel lifetime. Its full 1 test FLOP escrow was refunded. I kept that failure in the record.

I opened the second channel with a 3600-block lifetime and bounded its escrow to 1 test FLOP. A transcript-registration transaction then expired without inclusion. I checked its entire 64-block canonical validity range, completed the identical registration with the official SDK using a longer transaction validity period, and completed the preserved cooperative close through the official SDK. No third channel or replacement identity was created. The final settlement was checked against the exact signed claim, finalized event and closed channel.

## Post-test shutdown

After completing the test, I deregistered this miner and stopped the local worker, model service, tunnel and DA VM. Retirement finalized in transaction `0x30f5372995f4877ce40ba38ecf9a42d411a8615a0e4b2e8eb43731b39caf9d22`. The keys and audit evidence were retained privately. This is a historical experiment, not a currently running miner.

## Limits

The stock worker emitted the lanes-only activation format; the V3 receipt separately commits the actual native token IDs. A published commitment and a paid self-test do not establish cross-hardware numerical equivalence, sampling replay, or an approved Apple/MLX hardware cell. See the [Apple Silicon discussion](https://github.com/flop-labs/network/issues/268) and [official miner guide](https://docs.flop.network/docs/run-miner).

This repository remains a case study. Its existing benchmark and read-only verifier target the **initial legacy experiment**. Account-bound operational scripts, wallet secrets, bearer credentials, private audit encryption keys and raw logs are not published. The new evidence record is separate so the historical TOPLOC-off result stays reproducible.
