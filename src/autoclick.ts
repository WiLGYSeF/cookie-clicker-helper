declare const Game: CookieClicker.Game;

let autoclicking = 0;

function autoclick(duration: number): number {
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

export function autoclickGoldenCookies(clickWrath = false): number {
  return setInterval(() => {
    const shimmers = document.getElementsByClassName('shimmer');
    Array.prototype.forEach.call(shimmers, (shimmer: HTMLElement) => {
      const value = shimmer.attributes.getNamedItem('alt').nodeValue;
      if (
        value === 'Golden cookie'
        || (clickWrath && value === 'Wrath cookie')
        || value === 'Reindeer'
      ) {
        shimmer.click();
      }
    });
  }, 1000);
}

function isAutoclicking(): boolean {
  return autoclicking > 0;
}

export function autoclickWhenBuffed(): number {
  return setInterval(() => {
    const buffs = Object.keys(Game.buffs).map((k) => Game.buffs[k]);
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

export function autoclickFortune(): number {
  const eleCommentsText = document.getElementById('commentsText');
  return setInterval(() => {
    const fortune = eleCommentsText.querySelector('.fortune');
    if (fortune !== null) {
      (fortune as HTMLElement).click();
    }
  }, 1000);
}
