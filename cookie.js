// https://orteil.dashnet.org/cookieclicker/

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

    const val = ((2 / (1 + Math.exp(-production / price))) - 1).toExponential();
    eleCostRatio.innerHTML = val.substring(0, 6) + val.substring(val.length - 3);
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
  return observer;
}

function tooltipMagicRefillTime() {
  const tooltipAnchor = document.getElementById('tooltipAnchor');
  const tooltip = document.getElementById('tooltip');

  const grimoireBarText = document.getElementById('grimoireBarText');

  const updateTooltip = () => {
    const match = grimoireBarText.innerHTML.match(new RegExp(String.raw`^(\d+)/(\d+) \(\+([\d.]+)/s\)$`));
    if (match === null) {
      return;
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

      let eleRefillTime = getFirstElementByClassName(tooltip, 'refill-time');
      if (eleRefillTime === null) {
        const line = document.createElement('div');
        line.classList.add('line');
        div.appendChild(line);

        eleRefillTime = document.createElement('span');
        eleRefillTime.classList.add('refill-time');
        div.appendChild(eleRefillTime);
      }

      eleRefillTime.innerHTML = 'Refills in ' + secondsToStr(Math.trunc(remainingTime));
      break;
    }
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
  return observer;
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

function autoclickWhenBuffed() {
  return setInterval(() => {
    const buffs = Object.values(Game.buffs);
    if (buffs.length === 0) {
      return;
    }

    let maxTime = 0;

    for (const buff of buffs) {
      if (buff.add) {
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

var ttpit = tooltipPriceInTime();
var ttmrt = tooltipMagicRefillTime();
var acgc = autoclickGoldenCookies();
var acwb = autoclickWhenBuffed();

// ttpit.disconnect();
// ttmrt.disconnect();
// clearInterval(acgc);
// clearInterval(acwb);
