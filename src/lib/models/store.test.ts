import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { Store } from './store';
import MenuResponseRaw from './__stubs__/menu_raw.json';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get(`https://order.dominos.com/power/store/7956/menu`, () =>
    HttpResponse.json(MenuResponseRaw)
  ),
];
const server = setupServer(...handlers);

describe('The Store Model', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  const STORE_ID = '7956';
  test('it has an id', () => {
    const store = new Store(STORE_ID);
    expect(store.id).toBe(STORE_ID);
  });

  test('it can get a menu', async () => {
    const menu = await new Store(STORE_ID).menu();
    expect(menu).not.toBeUndefined();
    expect(menu.data).toBeDefined();
  });
});
