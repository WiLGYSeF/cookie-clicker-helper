const numberStrMap = {
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

function elementMutationObserver(element, callback) {
  let skip = 0;

  const observer = new MutationObserver((mutationsList, obs) => {
    if (skip > 0) {
      skip--;
      return;
    }

    let modified = 0;

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (callback()) {
          modified++;
        }
      }
    }

    if (modified > 0) {
      skip++;
    }
  });
  observer.observe(element, {
    childList: true,
    subtree: true,
  });
  return observer;
}

function getFirstElementByClassName(element, name) {
  const elements = element.getElementsByClassName(name);
  return elements.length !== 0 ? elements[0] : null;
}

function getFirstElementByTagName(element, name) {
  const elements = element.getElementsByTagName(name);
  return elements.length !== 0 ? elements[0] : null;
}

function toNumber(val) {
  const parts = val.replace(/,/g, '').split(' ');

  if (parts.length === 1) {
    return parseInt(parts[0], 10);
  } if (parts.length === 2) {
    return parseFloat(parts[0]) * numberStrMap[parts[1]];
  }
  return NaN;
}

function toNumberStr(val) {
  const keys = Object.keys(numberStrMap);
  for (let i = keys.length - 1; i >= 0; i--) {
    const mult = numberStrMap[keys[i]];
    if (mult < val) {
      return `${(val / mult).toFixed(3)} ${keys[i]}`;
    }
  }
  return val;
}

function secondsToStr(seconds) {
  let sec = seconds;
  let str = '';
  if (sec >= 86400) {
    str += `${Math.trunc(sec / 86400)}d `;
    sec %= 86400;
  }
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

module.exports = {
  elementMutationObserver,
  getFirstElementByClassName,
  getFirstElementByTagName,
  toNumber,
  toNumberStr,
  secondsToStr,
};
