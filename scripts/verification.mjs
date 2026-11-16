import assert from 'node:assert/strict';

export const normalizeHash = value => String(value).toLowerCase();

export function transactionEvents(records, index) {
  return records
    .filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.toNumber() === index)
    .map(({ event }) => ({ section: event.section, method: event.method, data: event.data.toJSON() }));
}

export function validateSettlement(events, expected) {
  assert(events.some(e => e.section === 'system' && e.method === 'ExtrinsicSuccess'), 'Settlement extrinsic did not succeed');
  const event = events.find(e => e.section === 'computeChannel' && e.method === 'Settled'
    && normalizeHash(e.data[0]) === normalizeHash(expected.channelId));
  assert(event, 'Matching channel settlement event is missing');
  assert.equal(BigInt(event.data[1]), BigInt(expected.minerPaidRaw), 'Miner payment differs');
  assert.equal(BigInt(event.data[2]), 0n, 'Unexpected burned amount');
  assert.equal(BigInt(event.data[3]), BigInt(expected.aggregateGn), 'Work amount differs');
  assert.equal(event.data[4], true, 'Settlement was not cooperative');
  return event;
}
