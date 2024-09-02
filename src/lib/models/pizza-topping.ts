export interface IPizzaTopping {
  code: string;
  name: string;
  isLocal: boolean;
  tags: string[];
  exclusivityGroup?: string;
}

export class PizzaTopping implements IPizzaTopping {
  public code;
  public name;
  public isLocal;
  public tags;
  public exclusivityGroup;

  constructor(options: IPizzaTopping) {
    this.code = options.code;
    this.name = options.name;
    this.isLocal = options.isLocal;
    this.tags = options.tags;
    this.exclusivityGroup = options.exclusivityGroup;
  }
}
