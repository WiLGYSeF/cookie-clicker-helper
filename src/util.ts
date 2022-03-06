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

export function elementMutationObserver(element: Node, callback: Function): MutationObserver {
  let skip = 0;

  const observer = new MutationObserver((mutationsList) => {
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

export function getFirstElementByClassName(element: HTMLElement, name: string): HTMLElement {
  const elements = element.getElementsByClassName(name);
  return elements.length !== 0 ? elements[0] as HTMLElement : null;
}

export function getFirstElementByTagName(element: HTMLElement, name: string): HTMLElement {
  const elements = element.getElementsByTagName(name);
  return elements.length !== 0 ? elements[0] as HTMLElement : null;
}

export function toNumber(val: string): number {
  const parts = val.replace(/,/g, '').split(' ');

  if (parts.length === 1) {
    return parseFloat(parts[0]);
  } if (parts.length === 2) {
    return parseFloat(parts[0]) * numberStrMap[parts[1] as keyof typeof numberStrMap];
  }
  return NaN;
}

export function toNumberStr(val: number): string {
  const keys = Object.keys(numberStrMap);
  for (let i = keys.length - 1; i >= 0; i--) {
    const mult = numberStrMap[keys[i] as keyof typeof numberStrMap];
    if (mult < val) {
      return `${(val / mult).toFixed(3)} ${keys[i]}`;
    }
  }
  return val.toString();
}

const UNITS: [number, string][] = [
  [31536000, 'y'],
  [86400, 'd'],
  [3600, 'h'],
  [60, 'm'],
  [1, 's'],
];

export function secondsToStr(seconds: number) {
  let sec = seconds;
  let str = '';
  let count = 0;

  if (!isFinite(seconds)) {
    return 'never';
  }

  for (const unit of UNITS) {
    if (sec >= unit[0]) {
      str += `${Math.floor(sec / unit[0])}${unit[1]} `;
      sec %= unit[0];
      count++;
    }
    if (count === 3) {
      break;
    }
  }
  return str.length === 0 ? '0s' : str.substring(0, str.length - 1);
}
