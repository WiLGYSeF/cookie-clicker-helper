// https://orteil.dashnet.org/cookieclicker/

// TODO: Game.cookiesPs does not take into account wrinklers
// TODO: autoclickWhenBuffed() does not know if buff times change

// TODO: work on new game

const utils = require('./utils');

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

var _tooltipHooks = [];

function tooltipHook() {
  const tooltip = document.getElementById('tooltip');
  return utils.elementMutationObserver(tooltip, () => {
    let modified = 0;
    for (const hook of _tooltipHooks) {
      if (hook(tooltip)) {
        modified++;
      }
    }
    return modified > 0;
  });
}

function ascendTooltipHook() {
  const tooltip = document.getElementById('ascendTooltip');
  return utils.elementMutationObserver(tooltip, () => {
    let eleRemainingTime = utils.getFirstElementByClassName(tooltip, 'remaining-time');
    if (eleRemainingTime === null) {
      eleRemainingTime = document.createElement('span');
      eleRemainingTime.classList.add('remaining-time');

      tooltip.appendChild(eleRemainingTime);
    }

    for (const b of tooltip.getElementsByTagName('b')) {
      const match = b.innerHTML.match(/^(.+) more cookies$/);
      if (match != null) {
        eleRemainingTime.innerHTML = utils.secondsToStr(
          Math.trunc(utils.toNumber(match[1]) / Game.cookiesPs),
        );
        break;
      }
    }
    return true;
  });
}

function tooltipPriceInTime(tooltip) {
  const elePrice = utils.getFirstElementByClassName(tooltip, 'price');
  if (elePrice === null || elePrice.classList.contains('lump')) {
    return false;
  }

  const price = utils.toNumber(elePrice.innerHTML);
  const parent = elePrice.parentElement;

  for (const small of parent.getElementsByTagName('small')) {
    if (small !== null && (
      small.innerHTML.includes(' CpS')
      || small.innerHTML.includes('to plant')
    )) {
      return false;
    }
  }

  let elePriceTime = utils.getFirstElementByClassName(tooltip, 'price-time');
  if (elePriceTime === null) {
    elePriceTime = document.createElement('span');
    elePriceTime.classList.add('price-time');

    parent.style.display = 'flex';
    parent.style.flexDirection = 'column';
    parent.appendChild(elePriceTime);
  }

  elePriceTime.innerHTML = utils.secondsToStr(Math.trunc(price / Game.cookiesPs));

  const data = utils.getFirstElementByClassName(tooltip, 'data');
  if (data === null) {
    return true;
  }

  const bold = utils.getFirstElementByTagName(data, 'b');
  const production = utils.toNumber(bold.innerHTML);
  if (Number.isNaN(production)) {
    return true;
  }

  let eleCostRatio = utils.getFirstElementByClassName(tooltip, 'cost-ratio');
  if (eleCostRatio === null) {
    eleCostRatio = document.createElement('span');
    eleCostRatio.classList.add('cost-ratio');

    parent.appendChild(eleCostRatio);
  }

  let val = ((2 / (1 + Math.exp(-production / price))) - 1).toExponential();
  if (val.length > 9) {
    val = val.substring(0, 6) + val.substring(val.length - 3);
  }
  eleCostRatio.innerHTML = val;
  return true;
}

function tooltipMagicRefillTime(tooltip) {
  const grimoireBarText = document.getElementById('grimoireBarText');
  const match = grimoireBarText.innerHTML.match(new RegExp(String.raw`^(\d+)/(\d+) \(\+([\d.]+)/s\)$`));
  if (match === null) {
    return false;
  }

  const remainingTime = (parseFloat(match[2]) - parseFloat(match[1])) / parseFloat(match[3]);

  let foundDiv = false;
  for (const div of tooltip.getElementsByTagName('div')) {
    for (const b of div.getElementsByTagName('b')) {
      if (b.innerHTML === 'Wizard towers') {
        foundDiv = true;
        break;
      }
    }

    if (!foundDiv) {
      continue;
    }

    let eleRefillTime = utils.getFirstElementByClassName(tooltip, 'refill-time');
    if (eleRefillTime === null) {
      const line = document.createElement('div');
      line.classList.add('line');
      div.appendChild(line);

      eleRefillTime = document.createElement('span');
      eleRefillTime.classList.add('refill-time');
      div.appendChild(eleRefillTime);
    }

    eleRefillTime.innerHTML = 'Refills in ' + utils.secondsToStr(Math.trunc(remainingTime));
    return true;
  }
  return false;
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
  let eleInfo = utils.getFirstElementByClassName(document, 'cookie-info');
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

  const wrinklerCookies = utils.getFirstElementByClassName(eleInfo, 'wrinkler-cookies');

  return setInterval(() => {
    wrinklerCookies.innerHTML = `Wrinkler Yield: ${utils.toNumberStr(Game.wrinklers[0].sucked)} cookies`;
  }, 200);
}

_tooltipHooks.push(tooltipPriceInTime);
_tooltipHooks.push(tooltipMagicRefillTime);

var bbp = borderBestProduct();
var tthook = tooltipHook();
var atthook = ascendTooltipHook();
var acgc = autoclickGoldenCookies(true);
var acwb = autoclickWhenBuffed();
var ci = cookieInfo();

// clearInterval(bbp);
// tthook.disconnect();
// atthook.disconnect();
// clearInterval(acgc);
// clearInterval(acwb);
// clearInterval(ci);
