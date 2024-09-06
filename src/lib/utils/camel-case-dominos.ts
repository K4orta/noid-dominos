import camelcaseKeys from 'camelcase-keys';

export function camelCaseDominos(input: Record<string, unknown>) {
  return camelcaseKeys(input, {
    // Skip keys with are all caps or are two characters long, as there are usually item codes used for lookups.
    exclude: [new RegExp('^[^a-z]*$'), new RegExp('^\\w{2}$')],
    deep: true,
  });
}
