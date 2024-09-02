import { expect, test, describe } from 'vitest';
import { Pizza } from './pizza';

describe('The Pizza model', () => {
  test('it can initialize a new model', () => {
    const pizza = new Pizza();
    expect(pizza).toBeDefined();
  });

  test('it can add a topping', () => {});
});
