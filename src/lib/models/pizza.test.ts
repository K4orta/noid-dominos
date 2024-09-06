import { expect, test, describe } from 'vitest';
import { Pizza } from './pizza';
import {
  cheese,
  pepperoni,
  honeyBbqSauce,
  robustInspiredTomatoSauce,
} from '../constants/pizza-toppings';
import {
  smallGlutenFreeCrustPizza,
  largeHandTossedPizza,
} from '../constants/pizza-crusts';

describe('The Pizza model', () => {
  test('it can initialize a new model', () => {
    const pizza = new Pizza();
    expect(pizza).toBeDefined();
  });

  test('it can add a topping', () => {
    const pizza = new Pizza();
    pizza.addTopping(pepperoni);

    expect(pizza.toppings.length).toBe(2);
    expect(pizza.toppings).toContain(cheese); // Should come with cheese by default
    expect(pizza.toppings).toContain(pepperoni);
  });

  test('it can set a crust', () => {
    const pizza = new Pizza();
    pizza.setCrust(smallGlutenFreeCrustPizza);

    expect(pizza.crust).toBe(smallGlutenFreeCrustPizza);
  });

  test('it can set a sauce', () => {
    const pizza = new Pizza();
    pizza.setSauce(honeyBbqSauce);
    expect(pizza.sauce).toBe(honeyBbqSauce);
  });

  test('it can render to json', () => {});

  test('it can render to Dominos format', () => {
    const pizza = new Pizza({
      crust: largeHandTossedPizza,
      sauce: robustInspiredTomatoSauce,
      toppings: [cheese, pepperoni],
    });

    const dominosItem = pizza.toDominos();
    console.log(dominosItem);
    expect(dominosItem.code).toBe('14SCREEN');
    expect(dominosItem.options['X']).toEqual({ '1/1': '1' });
    expect(dominosItem.options['C']).toEqual({ '1/1': '1' });
  });
});
