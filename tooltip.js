const utils = require('./utils');

const tooltipHooks = [];

function tooltipHook() {
  const tooltip = document.getElementById('tooltip');
  return utils.elementMutationObserver(tooltip, () => {
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

tooltipHooks.push(tooltipPriceInTime);
tooltipHooks.push(tooltipMagicRefillTime);

function modifyTooltips() {
  tooltipHook();
  ascendTooltipHook();
}

module.exports = {
  modifyTooltips,
};
