import { expect, describe, test } from 'vitest';
import { pepperoni, PizzaToppingAmount } from '../constants';
import { PizzaTopping } from './pizza-topping';

describe('The PizzaTopping model', () => {
  test('it can format its amount when covering the whole pizza', () => {
    const topping = new PizzaTopping({
      ...pepperoni.toJson(),
      leftAmount: PizzaToppingAmount.Extra,
      rightAmount: PizzaToppingAmount.Extra,
    });

    expect(topping.toDominos()).toEqual({ P: { '1/1': '1.5' } });
  });

  test('it can format its amount when topping is none', () => {
    const topping = new PizzaTopping({
      ...pepperoni.toJson(),
      leftAmount: PizzaToppingAmount.None,
      rightAmount: PizzaToppingAmount.None,
    });
    expect(topping.toDominos()).toEqual({ P: 0 });
  });

  test('it can format its amount when topping only covers half the pizza', () => {
    const topping = new PizzaTopping({
      ...pepperoni.toJson(),
      leftAmount: PizzaToppingAmount.None,
      rightAmount: PizzaToppingAmount.Light,
    });
    expect(topping.toDominos()).toEqual({ P: { '2/2': '0.5' } });
  });
});
