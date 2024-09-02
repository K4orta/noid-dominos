export async function get(url: string): Promise<unknown> {
  return await (
    await fetch(url, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })
  ).json();
}
