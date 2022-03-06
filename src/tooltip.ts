import { getUpgradeEffect } from './upgrade';
import { elementMutationObserver, getFirstElementByClassName, secondsToStr, toNumber } from './util';

declare const Game: CookieClicker.Game;

const tooltipHooks: Function[] = [];

function tooltipHook(): MutationObserver {
  const tooltip = document.getElementById('tooltip');
  return elementMutationObserver(tooltip, () => {
    let modified = 0;
    for (const hook of tooltipHooks) {
      if (hook(tooltip)) {
        modified++;
      }
    }
    return modified > 0;
  });
}

function ascendTooltipHook(): MutationObserver {
  const tooltip = document.getElementById('ascendTooltip');
  return elementMutationObserver(tooltip, () => {
    let eleRemainingTime = getFirstElementByClassName(tooltip, 'remaining-time');
    if (eleRemainingTime === null) {
      eleRemainingTime = document.createElement('span');
      eleRemainingTime.classList.add('remaining-time');

      tooltip.appendChild(eleRemainingTime);
    }

    for (const b of tooltip.getElementsByTagName('b')) {
      const match = b.innerHTML.match(/^(.+) more cookies$/);
      if (match != null) {
        eleRemainingTime.innerHTML = secondsToStr(
          Math.floor(toNumber(match[1]) / Game.cookiesPs),
        );
        break;
      }
    }
    return true;
  });
}

function tooltipPriceInTime(tooltip: HTMLElement): boolean {
  const elePrice = getFirstElementByClassName(tooltip, 'price');
  if (elePrice === null || elePrice.classList.contains('lump')) {
    return false;
  }

  const price = toNumber(elePrice.innerHTML);
  const parent = elePrice.parentElement;

  for (const small of parent.getElementsByTagName('small')) {
    if (small !== null && (
      small.innerHTML.includes(' CpS')
      || small.innerHTML.includes('to plant')
    )) {
      return false;
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

  elePriceTime.innerHTML = secondsToStr(Math.floor(price / Game.cookiesPs));

  const tag = getFirstElementByClassName(tooltip, 'tag');
  let production;
  if (tag && tag.innerHTML.match(/Upgrade|Cookie|Tech/)) {
    const upg = Game.Upgrades[getFirstElementByClassName(tooltip, 'name').innerHTML];
    if (upg) { // TODO: fix some names not being correct
      production = getUpgradeEffect(upg);
    }
  } else {
    const data = getFirstElementByClassName(tooltip, 'data');
    if (data === null) {
      return true;
    }
    const bold = data.querySelector('b');
    production = toNumber(bold.innerHTML);
  }

  /* eslint-disable-next-line no-restricted-globals */
  if (isNaN(production)) {
    return true;
  }

  let eleCostRatio = tooltip.querySelector('.cost-ratio');
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

function tooltipMagicRefillTime(tooltip: HTMLElement): boolean {
  const grimoireBarText = document.getElementById('grimoireBarText');
  if (grimoireBarText == null) {
    return false;
  }

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

    let eleRefillTime = tooltip.querySelector('.refill-time');
    if (eleRefillTime === null) {
      const line = document.createElement('div');
      line.classList.add('line');
      div.appendChild(line);

      eleRefillTime = document.createElement('span');
      eleRefillTime.classList.add('refill-time');
      div.appendChild(eleRefillTime);
    }

    eleRefillTime.innerHTML = 'Refills in ' + secondsToStr(Math.floor(remainingTime));
    return true;
  }
  return false;
}

tooltipHooks.push(tooltipPriceInTime);
tooltipHooks.push(tooltipMagicRefillTime);

export function modifyTooltips() {
  tooltipHook();
  ascendTooltipHook();
}
