import { writeFile } from 'node:fs/promises';
import MenuData from '../src/lib/models/__stubs__/menu_raw.json';
import { Menu } from '../src/lib/models/menu';
import camelcaseKeys from 'camelcase-keys';

console.log('Generating topping constants...');

const menu = new Menu(MenuData);

// Write toppings.

const toppings = menu.pizza.toppings
  .map((topping) => topping.toJson())
  .reduce((prev, current) => {
    prev[current.name] = current;
    return prev;
  }, {});
const camelcasedNames = camelcaseKeys(toppings);

let outputToppings = [
  "import { PizzaTopping } from '../models/pizza-topping';\n",
];
outputToppings = outputToppings.concat(
  Object.entries(camelcasedNames).map(
    ([name, value]) =>
      `export const ${name} = new PizzaTopping(${JSON.stringify(
        value,
        null,
        2
      )});\n\n`
  )
);

writeFile('src/lib/constants/pizza-toppings.ts', outputToppings, {
  encoding: 'utf8',
});

// Write crusts.

const crusts = menu.pizza.crusts
  .map((crust) => crust.toJson())
  .reduce((prev, current) => {
    const crustName = current.name.replace(/\(.*\) /, '');
    prev[crustName] = current;
    return prev;
  }, {});

const camelcasedCrusts = camelcaseKeys(crusts);

let outputCrusts = ["import { PizzaCrust } from '../models/pizza-crust';\n"];

outputCrusts = outputCrusts.concat(
  Object.entries(camelcasedCrusts).map(
    ([name, value]) =>
      `export const ${name} = new PizzaCrust(${JSON.stringify(
        value,
        null,
        2
      )});\n\n`
  )
);

writeFile('src/lib/constants/pizza-crusts.ts', outputCrusts, {
  encoding: 'utf8',
});

console.log('Done.');
