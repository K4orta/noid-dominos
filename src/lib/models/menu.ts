import camelcaseKeys from 'camelcase-keys';
import { writeFile } from 'node:fs/promises';
import { PizzaTopping } from './pizza-topping';

export type MenuOptions = {
  storeId: string;
};

export type MenuCategory = {
  code: string;
  name: string;
  hasSubCategories: boolean;
  hasProducts: boolean;
  hasTags: boolean;
  products?: string[];
  subCategories?: Record<string, MenuCategory>;
};

export type DominosMenu = {
  // categories: {
  //   food: {
  //     pizza: MenuCategory;
  //     sandwich: MenuCategory;
  //     pasta: MenuCategory;
  //     wings: MenuCategory;
  //     bread: MenuCategory;
  //     gSalad: MenuCategory;
  //     chips: MenuCategory;
  //     drinks: MenuCategory;
  //     dessert: MenuCategory;
  //     dips: MenuCategory;
  //     breadDipCombos: MenuCategory;
  //     tots: MenuCategory;
  //     sides: MenuCategory;
  //   };
  // };
  // coupons: {};
  flavors: {
    pizza: Record<
      string,
      {
        code: string;
        description: string;
      }
    >;
  };
  products: {
    S_PIZZA: {
      variants: string[];
    };
  };
  sides: {};
  toppings: {
    pizza: Record<
      string,
      {
        code: string;
        name: string;
        local: boolean;
        tags: Record<string, boolean | string>;
      }
    >;
  };
  variants: Record<
    string,
    {
      code: string;
      flavorCode: string;
      name: string;
      availableToppings: string;
      allowedCookingInstructions: string;
      price: string;
      surcharge: string;
    }
  >;
  preconfiguredProducts: {};
  shortProductDescriptions: {};
  unsupported: {};
  cooking: {};
};

export class Menu {
  public storeId: string;
  public isInitialized: boolean;
  public data?: DominosMenu;
  public pizza: {
    crusts: {
      code: string;
      name: string;
      description: string;
      surcharge: string;
      allowedCookingInstructions: string[];
      availableToppings: string[];
    }[];
    toppings: PizzaTopping[];
  };

  constructor(options: MenuOptions) {
    this.storeId = options.storeId;
    this.isInitialized = false;
    this.pizza = {
      crusts: [],
      toppings: [],
    };
  }

  async load() {
    const response = await fetch(
      `https://order.dominos.com/power/store/${this.storeId}/menu?lang=en&structured=true`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );

    this.parse(await response.json());

    this.isInitialized = true;
  }

  parse(payload: unknown) {
    this.data = camelcaseKeys(payload as Record<string, unknown>, {
      exclude: [new RegExp('^[^a-z]*$'), new RegExp('^\\w{2}$')],
      deep: true,
    }) as DominosMenu;
    // writeFile(
    //   'src/lib/models/__stubs__/menu_parsed.json',
    //   JSON.stringify(this.data, null, 2),
    //   { encoding: 'utf8' }
    // );
    // Populate crusts
    const crusts = this.data.products['S_PIZZA'].variants.map((variant) => {
      const crust = this.data?.variants[variant]!;
      const flavor = this.data?.flavors.pizza[crust.flavorCode]!;
      const { name, availableToppings, surcharge, allowedCookingInstructions } =
        crust;
      return {
        code: variant,
        name,
        description: flavor.description,
        availableToppings: availableToppings.split(','),
        surcharge,
        allowedCookingInstructions: allowedCookingInstructions.split(','),
      };
    });
    this.pizza.crusts = crusts;
    this.pizza.toppings = Object.values(this.data.toppings.pizza).map(
      (topping) => Menu.parseTopping(topping)
    );
  }

  static parseTopping(topping: {
    code: string;
    name: string;
    local: boolean;
    tags: Record<string, string | boolean>;
  }): PizzaTopping {
    const toppingTags = Object.entries(topping.tags)
      .filter(([_, value]) => typeof value === 'boolean')
      .map(([key, _]) => key);

    const parsedTopping = {
      code: topping.code,
      name: topping.name,
      isLocal: topping.local,
      tags: toppingTags,
      exclusivityGroup: topping.tags['exclusiveGroup'] as string | undefined,
    };
    return new PizzaTopping(parsedTopping);
  }
}
