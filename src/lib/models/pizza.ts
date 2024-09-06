import type { PizzaTopping } from './pizza-topping';
import type { PizzaCrust } from './pizza-crust';
import { mediumHandTossedPizza } from '../constants/pizza-crusts';
import { cheese, robustInspiredTomatoSauce } from '../constants/pizza-toppings';

export interface IPizza {
  toppings: PizzaTopping[];
  sauce: PizzaTopping;
  crust: PizzaCrust;
}
export class Pizza implements IPizza {
  public toppings;
  public sauce;
  public crust;
  constructor(options?: IPizza) {
    this.toppings = options?.toppings || [cheese];
    this.sauce = options?.sauce || robustInspiredTomatoSauce;
    this.crust = options?.crust || mediumHandTossedPizza;
  }

  addTopping(topping: PizzaTopping) {
    this.toppings.push(topping);
  }

  setCrust(crust: PizzaCrust) {
    this.crust = crust;
  }

  setSauce(sauce: PizzaTopping) {
    this.sauce = sauce;
  }

  toDominos() {
    return {
      code: this.crust.code,
      options: {
        [this.sauce.code]: { '1/1': '1' },
        ...this.toppings.reduce((prev, current) => {
          prev[current.code] = { '1/1': '1' };
          return prev;
        }, {} as Record<string, any>),
      },
    };
  }
}
