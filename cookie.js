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

  if (parts.length === 1) {
    return parseInt(parts[0], 10);
  } if (parts.length === 2) {
    return parseFloat(parts[0]) * multiplier[parts[1]];
  }
  return NaN;
}

function secondsToStr(seconds) {
  let sec = seconds;
  let str = '';
  if (sec >= 3600) {
    str += `${Math.trunc(sec / 3600)}h `;
    sec %= 3600;
  }
  if (sec >= 60) {
    str += `${Math.trunc(sec / 60)}m `;
    sec %= 60;
  }
  if (sec > 0) {
    str += `${sec}s `;
  }
  if (sec === 0 && str.length === 0) {
    str = '0s ';
  }
  return str.length === 0 ? '' : str.substring(0, str.length - 1);
}

function tooltipPriceInTime() {
  const tooltipAnchor = document.getElementById('tooltipAnchor');
  const tooltip = document.getElementById('tooltip');

  const updateTooltip = () => {
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

    elePriceTime.innerHTML = secondsToStr(Math.trunc(price / Game.cookiesPs));

    const data = getFirstElementByClassName(tooltip, 'data');
    if (data === null) {
      return;
    }

    const bold = getFirstElementByTagName(data, 'b');
    const production = toNumber(bold.innerHTML);
    if (Number.isNaN(production)) {
      return;
    }

    let eleCostRatio = getFirstElementByClassName(tooltip, 'cost-ratio');
    if (eleCostRatio === null) {
      eleCostRatio = document.createElement('span');
      eleCostRatio.classList.add('cost-ratio');

      parent.appendChild(eleCostRatio);
    }

    eleCostRatio.innerHTML = ((2 / (1 + Math.exp(-production / price))) - 1).toExponential();
  };

  let skip = 0;

  const observer = new MutationObserver((mutationsList, _) => {
    if (skip > 0) {
      skip--;
      return;
    }

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        updateTooltip();
      }
    }

    skip++;
  });
  observer.observe(tooltipAnchor, {
    childList: true,
    subtree: true,
  });
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
