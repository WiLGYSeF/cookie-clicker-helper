// https://orteil.dashnet.org/cookieclicker/

// TODO: garden harvest

// TODO: Game.cookiesPs does not take into account wrinklers
// TODO: sugar lump click?

import { autoclickFortune, autoclickGoldenCookies, autoclickWhenBuffed } from './autoclick';
import { highlightBestProduct } from './building';
import { harvestEol } from './garden';
import { modifyTooltips } from './tooltip';
import { highlightBestUpgrade } from './upgrade';
import { getFirstElementByClassName, toNumberStr } from './util';

declare const Game: CookieClicker.Game;

function cookieInfo() {
  let eleInfo = getFirstElementByClassName(document.body, 'cookie-info');
  if (eleInfo === null) {
    eleInfo = document.createElement('div');
    eleInfo.classList.add('cookie-info');
    eleInfo.style.position = 'absolute';
    eleInfo.style.width = '100%';
    eleInfo.style.background = 'rgba(0, 0, 0, 0.4)';
    eleInfo.style.fontWeight = 'bold';
    eleInfo.style.textAlign = 'center';
    eleInfo.style.zIndex = '5';

    const wrinklerCookies = document.createElement('p');
    wrinklerCookies.classList.add('wrinkler-cookies');
    eleInfo.appendChild(wrinklerCookies);

    const eleCookies = document.getElementById('cookies');
    eleCookies.parentElement.insertBefore(eleInfo, eleCookies.nextSibling);
  }

  const wrinklerCookies = getFirstElementByClassName(eleInfo, 'wrinkler-cookies');

  return setInterval(() => {
    let totalCookies = 0;
    let wrinklerCount = 0;

    for (const wrinkler of Game.wrinklers) {
      totalCookies += wrinkler.sucked;
      if (wrinkler.phase === 2) {
        wrinklerCount++;
      }
    }

    wrinklerCookies.innerHTML = `Wrinkler Yield: total ${toNumberStr(totalCookies)}`
    + ` / avg ${toNumberStr(wrinklerCount !== 0 ? totalCookies / wrinklerCount : 0)} cookies`;
  }, 200);
}

modifyTooltips();

highlightBestProduct();
highlightBestUpgrade();

// harvestEOL();

autoclickGoldenCookies(true);
autoclickWhenBuffed();
autoclickFortune();
cookieInfo();
