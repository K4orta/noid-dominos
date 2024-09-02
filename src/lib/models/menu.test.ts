import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { Menu } from './menu';
import MenuResponseRaw from './__stubs__/menu_raw.json';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get(`https://order.dominos.com/power/store/7956/menu`, () =>
    HttpResponse.json(MenuResponseRaw)
  ),
];
const server = setupServer(...handlers);

describe('The Menu model', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test('it takes options', () => {
    const menu = new Menu({ storeId: '1234' });
    expect(menu.storeId).toBe('1234');
  });

  test("it can load itself from the Domino's API", async () => {
    const menu = new Menu({ storeId: '7956' });
    await menu.load();
    expect(menu.data).toBeDefined();
  });

  test('it has a list of crust options', async () => {
    const menu = new Menu({ storeId: '7956' });
    await menu.load();
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

  test('it populates the pizza topping list', async () => {
    const menu = new Menu({ storeId: '7956' });
    await menu.load();
    const sauce = menu.pizza.toppings.find((topping) => topping.code === 'X');

    expect(menu.pizza.toppings.length).toBeGreaterThan(0);
    expect(sauce?.exclusivityGroup).toBe('Sauce');
  });
});
