declare const Game: CookieClicker.Game;

export function highlightBestProduct(): number {
  return setInterval(() => {
    const products = Game.ObjectsById.filter(
      (x) => !x.locked,
    ).map(
      (x): [CookieClicker.Object, number] => [x, x.cps(x) / x.price],
    );
    products.sort((a, b) => b[1] - a[1]);

    const colors = ['#00ff00', '#ffff00', '#ffa600'];
    let cidx = 0;

    for (const productpair of products) {
      const product = document.getElementById(`product${productpair[0].id}`);
      product.style.borderRight = cidx === colors.length ? '' : `4px solid ${colors[cidx++]}dd`;
      product.style.boxSizing = 'border-box';
    }
  }, 200);
}
