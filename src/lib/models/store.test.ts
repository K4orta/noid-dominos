import { describe, test, expect } from 'vitest';
import { Store } from './store';

describe('The Store Model', () => {
  const STORE_ID = '7956';
  test('it has an id', () => {
    const store = new Store(STORE_ID);
    expect(store.id).toBe(STORE_ID);
  });

  test('it can get a menu', async () => {
    const menu = await new Store(STORE_ID).menu();
    expect(menu).not.toBeUndefined();
    expect(menu.storeId).toBe(STORE_ID);
  });
});
