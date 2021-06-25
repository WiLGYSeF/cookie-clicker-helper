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

const UNITS = [
  [31536000, 'y'],
  [86400, 'd'],
  [3600, 'h'],
  [60, 'm'],
  [1, 's'],
];

function secondsToStr(seconds) {
  let sec = seconds;
  let str = '';
  let count = 0;
  for (const unit of UNITS) {
    if (sec >= unit[0]) {
      str += `${Math.trunc(sec / unit[0])}${unit[1]} `;
      sec %= unit[0];
      count++;
    }
    if (count === 3) {
      break;
    }
  }
  return str.length === 0 ? '0s' : str.substring(0, str.length - 1);
}

module.exports = {
  elementMutationObserver,
  getFirstElementByClassName,
  getFirstElementByTagName,
  toNumber,
  toNumberStr,
  secondsToStr,
};
