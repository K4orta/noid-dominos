type PizzaCrustOptions = {
  name: string;
  code: string;
};

export class PizzaCrust {
  public name: string;
  public code: string;

  constructor(options: PizzaCrustOptions) {
    this.name = options.name;
    this.code = options.code;
  }
}
