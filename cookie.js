function getFirstElementByTagName(element, name) {
  const elements = element.getElementsByTagName(name);
  return elements.length !== 0 ? elements[0] : null;
}

function getFirstElementByClassName(element, name) {
  const elements = element.getElementsByClassName(name);
  return elements.length !== 0 ? elements[0] : null;
}

function toNumber(val) {
  const parts = val.replace(/,/g, '').split(' ');
  const multiplier = {
    million: 1e6,
    billion: 1e9,
    trillion: 1e12,
    quadrillion: 1e15,
    quintillion: 1e18,
    sextillion: 1e21,
    septillion: 1e24,
    octillion: 1e27,
    nonillion: 1e30,
    decillion: 1e33,
    undecillion: 1e36,
    duodecillion: 1e39,
    tredecillion: 1e42,
    quattuordecillion: 1e45,
    quindecillion: 1e48,
    sexdecillion: 1e51,
    septendecillion: 1e54,
    octodecillion: 1e57,
    novemdecillion: 1e60,
    vigintillion: 1e63,
  };

  if (parts.length == 1) {
    return parseInt(parts[0], 10);
  } else
  if (parts.length == 2) {
    return parseFloat(parts[0]) * multiplier[parts[1]];
  } else {
    return NaN;
  }
}

function secondsToStr(seconds) {
  let str = '';
  if (seconds >= 3600) {
    str += `${(seconds / 3600) >> 0}h `;
    seconds %= 3600;
  }
  if (seconds >= 60) {
    str += `${(seconds / 60) >> 0}m `;
    seconds %= 60;
  }
  if (seconds > 0) {
    str += `${seconds}s `;
  }
  if (seconds === 0 && str.length === 0) {
    str = '0s ';
  }
  return str.length === 0 ? '' : str.substring(0, str.length - 1);
}

function tooltipPriceInTime() {
  const tooltip = document.getElementById('tooltip');
  return setInterval(() => {
    const elePrice = getFirstElementByClassName(tooltip, 'price');
    if (elePrice === null || elePrice.classList.contains('lump')) {
      return;
    }

    const price = toNumber(elePrice.innerHTML);
    const parent = elePrice.parentElement;

    for (const small of parent.getElementsByTagName('small')) {
      if (small !== null && (
        small.innerHTML.includes(' CpS')
        || small.innerHTML.includes('to plant')
      )) {
        return;
      }
    }

    let elePriceTime = getFirstElementByClassName(tooltip, 'price-time');
    if (elePriceTime === null) {
      elePriceTime = document.createElement('span');
      elePriceTime.classList.add('price-time');

      parent.style.display = 'flex';
      parent.style.flexDirection = 'column';
      parent.appendChild(elePriceTime);
    }

    elePriceTime.innerHTML = secondsToStr((price / Game.cookiesPs) >> 0);

    const data = getFirstElementByClassName(tooltip, 'data');
    if (data === null) {
      return;
    }

    const bold = getFirstElementByTagName(data, 'b');
    const production = toNumber(bold.innerHTML);
    if (isNaN(production)) {
      return;
    }

    let eleCostRatio = getFirstElementByClassName(tooltip, 'cost-ratio');
    if (eleCostRatio === null) {
      eleCostRatio = document.createElement('span');
      eleCostRatio.classList.add('price-time');

      parent.appendChild(eleCostRatio);
    }

    eleCostRatio.innerHTML = production / price;
  }, 250);
}

function autoclick(duration) {
  const bigCookie = document.getElementById('bigCookie');
  const intv = setInterval(() => {
    bigCookie.click();
  }, 100);

  if (duration > 0) {
    setTimeout(() => {
      clearInterval(intv);
    }, duration);
  }
  return intv;
}

function autoclickGoldenCookies() {
  return setInterval(() => {
    const shimmers = document.getElementsByClassName('shimmer');
    for (const shimmer of shimmers) {
      if (shimmer.attributes.alt.nodeValue === 'Golden cookie') {
        shimmer.click();
      }
    }
  }, 1000);
}

var ttpit = tooltipPriceInTime();
var acgc = autoclickGoldenCookies();

// clearInterval(ttpit);
// clearInterval(acgc);
