import { Menu } from './menu';
export class Store {
  id: string;
  constructor(storeId: string) {
    this.id = storeId;
    return this;
  }

  async menu() {
    const response = await fetch(
      `https://order.dominos.com/power/store/${this.id}/menu?lang=en&structured=true`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );

    return new Menu(await response.json());
  }
}
