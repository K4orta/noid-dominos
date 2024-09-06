export interface IPizzaCrust {
  name: string;
  code: string;
  description: string;
  allowedCookingInstructions: string[];
  surcharge: string;
  availableToppings: string[];
}

export class PizzaCrust implements IPizzaCrust {
  public name;
  public code;
  public description;
  public surcharge;
  public allowedCookingInstructions;
  public availableToppings;

  constructor(options: IPizzaCrust) {
    this.name = options.name;
    this.code = options.code;
    this.description = options.description;
    this.surcharge = options.surcharge;
    this.allowedCookingInstructions = options.allowedCookingInstructions;
    this.availableToppings = options.availableToppings;
  }

  toJson(): IPizzaCrust {
    return {
      name: this.name,
      code: this.code,
      description: this.description,
      surcharge: this.surcharge,
      allowedCookingInstructions: this.allowedCookingInstructions,
      availableToppings: this.availableToppings,
    };
  }
}
