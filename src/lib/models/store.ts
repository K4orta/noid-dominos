import camelcaseKeys from 'camelcase-keys';
import { Menu } from './menu';

export interface IStore {
  storeId: string;
  allowCarryoutOrders?: boolean;
  allowDeliveryOrders?: boolean;
  isOpen?: boolean;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  addressDescription?: string;
  storeCoordinates?: {
    storeLatitude: string;
    storeLongitude: string;
  };
}
export class Store implements IStore {
  public storeId;
  public allowCarryoutOrders;
  public allowDeliveryOrders;
  public isOpen;
  public address;
  public addressDescription;
  public storeCoordinates;

  constructor(options: IStore) {
    this.storeId = options.storeId;
    this.allowCarryoutOrders = options.allowCarryoutOrders;
    this.allowDeliveryOrders = options.allowDeliveryOrders;
    this.isOpen = options.isOpen;
    this.address = options.address;
    this.addressDescription = options.addressDescription;
    this.storeCoordinates = options.storeCoordinates;
    return this;
  }

  async menu() {
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

    return new Menu(await response.json());
  }

  static async findAllNear(address: string, type: string = 'delivery') {
    const requestUrl = new URL('https://order.dominos.com/power/store-locator');
    const searchType = address.length === 5 ? 'c' : 's';

    requestUrl.searchParams.append(searchType, address);
    requestUrl.searchParams.append('type', type);
    const response = await fetch(requestUrl.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });

    return camelcaseKeys(await response.json(), { deep: true }).stores;
  }
}
