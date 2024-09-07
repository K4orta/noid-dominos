import {
  PizzaToppingAmount,
  PizzaToppingCover,
} from '../constants/pizza-topping-options';
export interface IPizzaTopping {
  code: string;
  name: string;
  isLocal: boolean;
  tags: string[];
  exclusivityGroup?: string;
  leftAmount?: PizzaToppingAmount;
  rightAmount?: PizzaToppingAmount;
}

export class PizzaTopping implements IPizzaTopping {
  public code;
  public name;
  public isLocal;
  public tags;
  public exclusivityGroup;
  public leftAmount?: PizzaToppingAmount;
  public rightAmount?: PizzaToppingAmount;

  constructor(options: IPizzaTopping) {
    this.code = options.code;
    this.name = options.name;
    this.isLocal = options.isLocal;
    this.tags = options.tags;
    this.exclusivityGroup = options.exclusivityGroup;
    this.leftAmount =
      options.leftAmount === undefined
        ? PizzaToppingAmount.Normal
        : options.leftAmount;
    this.rightAmount =
      options.rightAmount === undefined
        ? PizzaToppingAmount.Normal
        : options.rightAmount;
  }

  toJson(): IPizzaTopping {
    return {
      code: this.code,
      name: this.name,
      isLocal: this.isLocal,
      tags: this.tags,
      ...(this.exclusivityGroup && { exclusivityGroup: this.exclusivityGroup }),
      leftAmount: this.leftAmount,
      rightAmount: this.rightAmount,
    };
  }

  toDominos(): { [code: string]: { [key in PizzaToppingCover]?: string } | 0 } {
    if (
      this.leftAmount === PizzaToppingAmount.None &&
      this.leftAmount === this.rightAmount
    ) {
      // Both sides are none
      return { [this.code]: 0 };
    }

    if (this.leftAmount === this.rightAmount) {
      // Both sides are covered
      return {
        [this.code]: { [PizzaToppingCover.Whole]: String(this.leftAmount) },
      };
    }

    return {
      [this.code]: {
        ...(this.leftAmount !== PizzaToppingAmount.None && {
          [PizzaToppingCover.Left]: String(this.leftAmount),
        }),
        ...(this.rightAmount !== PizzaToppingAmount.None && {
          [PizzaToppingCover.Right]: String(this.rightAmount),
        }),
      },
    };
  }
}
