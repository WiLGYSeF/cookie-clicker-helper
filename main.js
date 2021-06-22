// https://orteil.dashnet.org/cookieclicker/

// TODO: Game.cookiesPs does not take into account wrinklers
// TODO: autoclickWhenBuffed() does not know if buff times change

// TODO: work on new game

const util = require('./util');
const tooltip = require('./tooltip');

function borderBestProduct() {
  return setInterval(() => {
    const products = Game.ObjectsById.filter(
      (x) => !x.locked,
    ).map(
      (x) => [x, x.cps(x) / x.price],
    );
    products.sort((a, b) => b[1] - a[1]);

    const colors = ['#00ff00', '#ffff00'];
    let cidx = 0;

    for (const productpair of products) {
      const product = document.getElementById(`product${productpair[0].id}`);
      product.style.border = cidx === colors.length ? '' : `1px solid ${colors[cidx++]}`;
      product.style.boxSizing = 'border-box';
    }
  }, 250);
}

var _autoclicking = 0;

function autoclick(duration) {
  const bigCookie = document.getElementById('bigCookie');

  _autoclicking++;
  const intv = setInterval(() => {
    bigCookie.click();
  }, 100);

  if (duration > 0) {
    setTimeout(() => {
      clearInterval(intv);
      _autoclicking--;
    }, duration);
  }
  return intv;
}

function isAutoclicking() {
  return _autoclicking > 0;
}

function autoclickGoldenCookies(clickWrath = false) {
  return setInterval(() => {
    const shimmers = document.getElementsByClassName('shimmer');
    for (const shimmer of shimmers) {
      if (
        shimmer.attributes.alt.nodeValue === 'Golden cookie'
        || (clickWrath && shimmer.attributes.alt.nodeValue === 'Wrath cookie')
      ) {
        shimmer.click();
      }
    }
  }, 1000);
}

function autoclickWhenBuffed() {
  return setInterval(() => {
    const buffs = Object.values(Game.buffs);
    if (buffs.length === 0) {
      return;
    }

    let maxTime = 0;

    for (const buff of buffs) {
      if (buff.add) { /* && buff.arg1 > 1 */
        if (buff.time > maxTime) {
          maxTime = buff.time;
        }
      }
    }

    if (maxTime > 0 && !isAutoclicking()) {
      autoclick((maxTime / 30) * 1000);
    }
  }, 1000);
}

function cookieInfo() {
  let eleInfo = util.getFirstElementByClassName(document, 'cookie-info');
  if (eleInfo === null) {
    eleInfo = document.createElement('div');
    eleInfo.classList.add('cookie-info');
    eleInfo.style.position = 'absolute';
    eleInfo.style.width = '100%';
    eleInfo.style.background = 'rgba(0, 0, 0, 0.4)';
    eleInfo.style.fontWeight = 'bold';
    eleInfo.style.textAlign = 'center';

    const wrinklerCookies = document.createElement('p');
    wrinklerCookies.classList.add('wrinkler-cookies');
    eleInfo.appendChild(wrinklerCookies);

    const eleCookies = document.getElementById('cookies');
    eleCookies.parentElement.insertBefore(eleInfo, eleCookies.nextSibling);
  }

  const wrinklerCookies = util.getFirstElementByClassName(eleInfo, 'wrinkler-cookies');

  return setInterval(() => {
    wrinklerCookies.innerHTML = `Wrinkler Yield: ${util.toNumberStr(Game.wrinklers[0].sucked)} cookies`;
  }, 200);
}

tooltip.modifyTooltips();

var bbp = borderBestProduct();
var acgc = autoclickGoldenCookies(true);
var acwb = autoclickWhenBuffed();
var ci = cookieInfo();

// clearInterval(bbp);
// clearInterval(acgc);
// clearInterval(acwb);
// clearInterval(ci);
