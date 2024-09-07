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
    return this;
  }

  setCrust(crust: PizzaCrust) {
    this.crust = crust;
    return this;
  }

  setSauce(sauce: PizzaTopping) {
    this.sauce = sauce;
    return this;
  }

  toJson() {
    return {
      toppings: this.toppings.map((topping) => topping.toJson()),
      sauce: this.sauce.toJson(),
      crust: this.crust.toJson(),
    };
  }

  toDominos() {
    return {
      code: this.crust.code,
      options: {
        ...this.sauce.toDominos(),
        ...this.toppings.reduce((prev, current) => {
          return {
            ...prev,
            ...current.toDominos(),
          };
        }, {} as Record<string, any>),
      },
    };
  }
}
