// https://orteil.dashnet.org/cookieclicker/

// TODO: Game.cookiesPs does not take into account wrinklers
// TODO: autoclickWhenBuffed() does not know if buff times change

const autoclick = require('./autoclick');
const building = require('./building');
const tooltip = require('./tooltip');
const upgrade = require('./upgrade');
const util = require('./util');

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
    eleInfo.style.zIndex = 5;

    const wrinklerCookies = document.createElement('p');
    wrinklerCookies.classList.add('wrinkler-cookies');
    eleInfo.appendChild(wrinklerCookies);

    const eleCookies = document.getElementById('cookies');
    eleCookies.parentElement.insertBefore(eleInfo, eleCookies.nextSibling);
  }

  const wrinklerCookies = util.getFirstElementByClassName(eleInfo, 'wrinkler-cookies');

  return setInterval(() => {
    let totalCookies = 0;
    let wrinklerCount = 0;

    for (const wrinkler of Game.wrinklers) {
      totalCookies += wrinkler.sucked;
      if (wrinkler.phase === 2) {
        wrinklerCount++;
      }
    }

    wrinklerCookies.innerHTML = `Wrinkler Yield: total ${util.toNumberStr(totalCookies)}`
    + ` / avg ${util.toNumberStr(wrinklerCount !== 0 ? totalCookies / wrinklerCount : 0)} cookies`;
  }, 200);
}

tooltip.modifyTooltips();

building.borderBestProduct();
upgrade.borderBestUpgrade();

autoclick.autoclickGoldenCookies(true);
autoclick.autoclickWhenBuffed();
autoclick.autoclickFortune();
cookieInfo();
