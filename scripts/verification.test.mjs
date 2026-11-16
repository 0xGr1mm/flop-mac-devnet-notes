import test from 'node:test';
import assert from 'node:assert/strict';
import { transactionEvents, validateSettlement } from './verification.mjs';

const expected = { channelId: '0x1234', minerPaidRaw: '990000000000000000', aggregateGn: '41' };
const success = { section: 'system', method: 'ExtrinsicSuccess', data: [] };
const settlement = { section: 'computeChannel', method: 'Settled', data: ['0x1234', '0x0dbd2fc137a30000', 0, 41, true] };
const record = (index, event) => ({ phase: { isApplyExtrinsic: true, asApplyExtrinsic: { toNumber: () => index } }, event: { ...event, data: { toJSON: () => event.data } } });

test('unrelated successful settlement in the same block cannot validate this transaction', () => {
  const records = [record(3, success), record(3, settlement), record(4, { section: 'system', method: 'ExtrinsicFailed', data: [] })];
  assert.throws(() => validateSettlement(transactionEvents(records, 4), expected));
});

test('an exact cooperative payment validates hex-encoded chain amounts', () => {
  assert.equal(validateSettlement([success, settlement], expected), settlement);
});

test('wrong channel, payment, work or cooperative flag is rejected', () => {
  for (const [field, value] of [[0, '0xabcd'], [1, '0'], [3, 42], [4, false]]) {
    const data = [...settlement.data];
    data[field] = value;
    assert.throws(() => validateSettlement([success, { ...settlement, data }], expected));
  }
});
