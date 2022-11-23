import { sum } from './index';

test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});

test('basic async', async () => {
  expect(sum()).toBe(0);
});

test('basic again async', async () => {
  expect(sum(1, 2)).toBe(3);
}, 1000 /* optional timeout */);
