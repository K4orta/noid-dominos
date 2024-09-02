import { describe, test, expect } from 'vitest';
import { Menu } from './menu';
import MenuResponseRaw from './__stubs__/menu_raw.json';

describe('The Menu model', () => {
  test("it can load itself from the Domino's API", () => {
    const menu = new Menu(MenuResponseRaw);
    expect(menu.data).toBeDefined();
  });

  test('it has a list of crust options', () => {
    const menu = new Menu(MenuResponseRaw);
    expect(menu.pizza.crusts.length).toBeGreaterThan(0);
    const crust = menu.pizza.crusts.at(0)!;
    expect(crust.code).toBeDefined();
    expect(crust.name).toBeDefined();
    expect(crust.description).toBeDefined();
    expect(crust.availableToppings).toBeDefined();
  });

  test('it can parse a topping', () => {
    const testTopping = {
      availability: [],
      code: 'X',
      description: '',
      local: false,
      name: 'Robust Inspired Tomato Sauce',
      tags: {
        wholeOnly: true,
        ignoreQty: true,
        exclusiveGroup: 'Sauce',
        sauce: true,
        nonMeat: true,
      },
    };
    const topping = Menu.parseTopping(testTopping);
    expect(topping.code).toBe('X');
    expect(topping.exclusivityGroup).toBe('Sauce');
    expect(topping.tags).toContain('wholeOnly');
  });

  test('it populates the pizza topping list', () => {
    const menu = new Menu(MenuResponseRaw);
    const sauce = menu.pizza.toppings.find((topping) => topping.code === 'X');

    expect(menu.pizza.toppings.length).toBeGreaterThan(0);
    expect(sauce?.exclusivityGroup).toBe('Sauce');
  });
});
