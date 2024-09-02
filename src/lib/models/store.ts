import { Menu } from './menu';
export class Store {
  id: string;
  constructor(storeId: string) {
    this.id = storeId;
    return this;
  }

  async menu() {
    return new Menu({ storeId: this.id });
  }
}
