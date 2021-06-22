let autoclicking = 0;

function autoclick(duration) {
  const bigCookie = document.getElementById('bigCookie');

  autoclicking++;
  const intv = setInterval(() => {
    bigCookie.click();
  }, 100);

  if (duration > 0) {
    setTimeout(() => {
      clearInterval(intv);
      autoclicking--;
    }, duration);
  }
  return intv;
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

function isAutoclicking() {
  return autoclicking > 0;
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

module.exports = {
  autoclick,
  isAutoclicking,
  autoclickGoldenCookies,
  autoclickWhenBuffed,
};
