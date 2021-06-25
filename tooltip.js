const upgrade = require('./upgrade');
const util = require('./util');

const tooltipHooks = [];

function tooltipHook() {
  const tooltip = document.getElementById('tooltip');
  return util.elementMutationObserver(tooltip, () => {
    let modified = 0;
    for (const hook of tooltipHooks) {
      if (hook(tooltip)) {
        modified++;
      }
    }
    return modified > 0;
  });
}

function ascendTooltipHook() {
  const tooltip = document.getElementById('ascendTooltip');
  return util.elementMutationObserver(tooltip, () => {
    let eleRemainingTime = util.getFirstElementByClassName(tooltip, 'remaining-time');
    if (eleRemainingTime === null) {
      eleRemainingTime = document.createElement('span');
      eleRemainingTime.classList.add('remaining-time');

      tooltip.appendChild(eleRemainingTime);
    }

    for (const b of tooltip.getElementsByTagName('b')) {
      const match = b.innerHTML.match(/^(.+) more cookies$/);
      if (match != null) {
        eleRemainingTime.innerHTML = util.secondsToStr(
          Math.trunc(util.toNumber(match[1]) / Game.cookiesPs),
        );
        break;
      }
    }
    return true;
  });
}

function tooltipPriceInTime(tooltip) {
  const elePrice = util.getFirstElementByClassName(tooltip, 'price');
  if (elePrice === null || elePrice.classList.contains('lump')) {
    return false;
  }

  const price = util.toNumber(elePrice.innerHTML);
  const parent = elePrice.parentElement;

  for (const small of parent.getElementsByTagName('small')) {
    if (small !== null && (
      small.innerHTML.includes(' CpS')
      || small.innerHTML.includes('to plant')
    )) {
      return false;
    }
  }

  let elePriceTime = util.getFirstElementByClassName(tooltip, 'price-time');
  if (elePriceTime === null) {
    elePriceTime = document.createElement('span');
    elePriceTime.classList.add('price-time');

    parent.style.display = 'flex';
    parent.style.flexDirection = 'column';
    parent.appendChild(elePriceTime);
  }

  elePriceTime.innerHTML = util.secondsToStr(Math.trunc(price / Game.cookiesPs));

  const tag = util.getFirstElementByClassName(tooltip, 'tag');
  let production;
  if (tag && tag.innerHTML.match(/Upgrade|Cookie|Tech/)) {
    const upg = Game.Upgrades[util.getFirstElementByClassName(tooltip, 'name').innerHTML];
    if (upg) { // TODO: fix some names not being correct
      production = upgrade.getUpgradeEffect(upg);
    }
  } else {
    const data = util.getFirstElementByClassName(tooltip, 'data');
    if (data === null) {
      return true;
    }
    const bold = util.getFirstElementByTagName(data, 'b');
    production = util.toNumber(bold.innerHTML);
  }

  /* eslint-disable-next-line no-restricted-globals */
  if (isNaN(production)) {
    return true;
  }

  let eleCostRatio = util.getFirstElementByClassName(tooltip, 'cost-ratio');
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

    let eleRefillTime = util.getFirstElementByClassName(tooltip, 'refill-time');
    if (eleRefillTime === null) {
      const line = document.createElement('div');
      line.classList.add('line');
      div.appendChild(line);

      eleRefillTime = document.createElement('span');
      eleRefillTime.classList.add('refill-time');
      div.appendChild(eleRefillTime);
    }

    eleRefillTime.innerHTML = 'Refills in ' + util.secondsToStr(Math.trunc(remainingTime));
    return true;
  }
  return false;
}

tooltipHooks.push(tooltipPriceInTime);
tooltipHooks.push(tooltipMagicRefillTime);

function modifyTooltips() {
  tooltipHook();
  ascendTooltipHook();
}

module.exports = {
  modifyTooltips,
};
