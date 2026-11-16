import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ApiPromise, HttpProvider } from '@polkadot/api';
import { normalizeHash, transactionEvents, validateSettlement } from './verification.mjs';

const proof = JSON.parse(fs.readFileSync(new URL('../evidence/devnet-test.json', import.meta.url), 'utf8'));
const endpoint = process.env.FLOP_RPC || 'https://rpc.devnet.flop.network';
const url = new URL(endpoint);
assert(url.protocol === 'https:' || (url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)), 'Use HTTPS or a loopback HTTP RPC');
assert(!url.username && !url.password, 'Do not place RPC credentials in this command');

let api;
const deadline = setTimeout(() => {
  console.error('Verification timed out. Historical RPC availability is required; no transactions were submitted.');
  process.exit(2);
}, 120_000);

try {
  api = await ApiPromise.create({ provider: new HttpProvider(endpoint, { 'User-Agent': 'flop-mac-devnet-notes/read-only' }), noInitWarn: true });
  assert.equal(normalizeHash(api.genesisHash.toHex()), normalizeHash(proof.genesisHash), 'Wrong network genesis');
  const finalizedHead = await api.rpc.chain.getFinalizedHead();
  const finalizedNumber = (await api.rpc.chain.getHeader(finalizedHead)).number.toNumber();

  async function readTransaction(record) {
    const block = await api.rpc.chain.getBlock(record.blockHash);
    const number = block.block.header.number.toNumber();
    assert(finalizedNumber >= number, 'Recorded block is ahead of finalized head');
    assert.equal(normalizeHash((await api.rpc.chain.getBlockHash(number)).toHex()), normalizeHash(record.blockHash), 'Recorded block is not canonical on this RPC');
    const index = block.block.extrinsics.findIndex(tx => normalizeHash(tx.hash.toHex()) === normalizeHash(record.txHash));
    assert(index >= 0, 'Expected transaction is absent from recorded block');
    const at = await api.at(record.blockHash);
    const events = transactionEvents(await at.query.system.events(), index);
    assert(events.some(e => e.section === 'system' && e.method === 'ExtrinsicSuccess'), 'Recorded transaction did not succeed');
    return { at, events, number, index };
  }

  const settled = await readTransaction(proof.settlement);
  assert.equal(settled.number, proof.settlement.blockNumber, 'Settlement block number differs');
  assert.equal(settled.index, proof.settlement.extrinsicIndex, 'Settlement transaction index differs');
  validateSettlement(settled.events, proof.settlement);
  const channel = await settled.at.query.computeChannel.channels(proof.settlement.channelId);
  assert(channel.isSome && channel.unwrap().state.isClosed, 'Channel was not closed at settlement');
  assert.equal(channel.unwrap().miner.toString(), proof.miner, 'Channel miner differs');
  assert.equal(normalizeHash(channel.unwrap().modelHash.toHex()), normalizeHash(proof.model.registeredRoot), 'Model differs');
  console.log(`PASS: finalized cooperative settlement at block ${settled.number}; ${proof.settlement.minerPaidTestFlop} test FLOP, ${proof.settlement.aggregateGn} G_n.`);

  const calibration = await readTransaction(proof.calibration);
  const accepted = calibration.events.find(e => e.section === 'hwCalibration' && e.method === 'BenchmarkBurstAccepted' && e.data[0] === proof.miner);
  assert(accepted, 'Calibration acceptance event missing');
  assert.equal(BigInt(accepted.data[1]), BigInt(proof.calibration.acceptedCapacityGflopsPerSecond));
  assert.equal(accepted.data[3], proof.calibration.assuranceTier);
  assert.equal(Number(accepted.data[4]), proof.calibration.calibrationVersion);
  assert.equal(Number(accepted.data[5]), proof.calibration.verifiedJobs);
  console.log('PASS: historical 100 GFLOP/s SOFT calibration, 64 reference jobs; not an independent GPU benchmark.');

  const recovery = await readTransaction(proof.firstAttemptRefund);
  const refunded = recovery.events.find(e => e.section === 'computeChannel' && e.method === 'TimedOutRefunded'
    && normalizeHash(e.data[0]) === normalizeHash(proof.firstAttemptRefund.channelId));
  assert(refunded, 'First-attempt refund event missing');
  assert.equal(BigInt(refunded.data[1]), BigInt(proof.firstAttemptRefund.refundedRaw));
  console.log('PASS: failed first attempt refunded its 1 test FLOP escrow.');

  const retired = await readTransaction(proof.retirement);
  assert(retired.events.some(e => e.section === 'minerStaking' && e.method === 'MinerDeregistered' && e.data[0] === proof.miner), 'Retirement event missing');
  assert((await retired.at.query.minerStaking.miners(proof.miner)).isNone, 'Miner remained registered at retirement block');
  assert.equal(BigInt((await retired.at.query.minerStaking.sponsoredStakeByMiner(proof.miner)).toString()), 0n);
  console.log('PASS: historical deregistration and zero active sponsored stake at retirement.');
  console.log('No keys loaded or transactions submitted. These checks do not establish testnet rewards or profitability.');
} catch (error) {
  console.error(`Verification failed or unavailable: ${error.message}`);
  process.exitCode = 1;
} finally {
  clearTimeout(deadline);
  await api?.disconnect();
}
