import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { Store } from './store';
import MenuResponseRaw from './__stubs__/menu_raw.json';
import StoreLocatorZip from './__stubs__/store_locator_zip.json';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get(`https://order.dominos.com/power/store/7956/menu`, () =>
    HttpResponse.json(MenuResponseRaw)
  ),
  http.get(`https://order.dominos.com/power/store-locator`, () =>
    HttpResponse.json(StoreLocatorZip)
  ),
];
const server = setupServer(...handlers);

describe('The Store Model', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  const STORE_ID = '7956';
  test('it has an id', () => {
    const store = new Store({ storeId: STORE_ID });
    expect(store.storeId).toBe(STORE_ID);
  });

  test('it can get a menu', async () => {
    const menu = await new Store({ storeId: STORE_ID }).menu();
    expect(menu).not.toBeUndefined();
    expect(menu.data).toBeDefined();
  });

  test('it can find nearby stores', async () => {
    const stores = await Store.findAllNear('94122');

    expect(stores.length).toBeGreaterThan(0);
    expect(stores.at(0).storeId).toBe('8418');
    expect(stores.at(0).addressDescription).toBe(
      '3116 Noriega Street\nSan Francisco, CA 94116\nBetween 37TH AVE and 38TH AVE.'
    );
  });

  test('it can construct itself from fetched store data', async () => {
    const stores = await Store.findAllNear('94122');
    const store = new Store(stores.at(0));

    expect(store.isOpen).toBe(true);
    expect(store.address?.postalCode).toBe('94116');
    expect(store.storeCoordinates?.storeLatitude).toBe('37.7534');
  });
});
