// THIS IS A PARTIAL DEFINITION FILE

declare module CookieClicker {
  export interface Game {
    BuildingsOwned: number;
    Object(
      name: string,
      commonName: string,
      desc: string,
      icon: number,
      iconColumn: number,
      art: any,
      price: number,
      cps: number,
      buyFunction: Function,
    ): Object;
    Objects: { [key: string]: Object };
    ObjectsById: Object[];
    Upgrades: { [key: string]: Upgrade };
    UpgradesById: Upgrade[];
    buffs: { [key: string]: Buff };
    cookiesPs: number;
    wrinklers: Wrinkler[];
  }

  export interface Buff {
    add: boolean;
    arg1: any;
    arg2: any;
    arg3: any;
    aura: number;
    desc: string;
    icon: [number, number];
    id: number;
    l: HTMLDivElement;
    maxTime: number;
    multCps: number;
    name: string;
    time: number;
    type: {
      func(time: number, pow: number): {
        name: string,
        desc: string
        icon: [number, number],
        time: number,
        add: boolean,
        power: number,
        aura: number;
      };
      id: number;
      name: string;
      vanilla: number;
    };
    visible: boolean;
  }

  export interface Object {
    actionName: string;
    amount: number;
    art: any;
    baseCps: Function;
    bought: number;
    bulkPrice: number;
    buy(amount: number): void;
    buyFree(amount: number): void;
    buyFunction: Function;
    cps: Function;
    desc: string;
    displayName: string;
    draw: Function;
    eachFrame: number;
    extraName: string;
    extraPlural: string;
    fortune: any;
    free: number;
    getFree(amount: number): void;
    getFreeRanks(amount: number): void;
    getPrice(n: number): number;
    getReverseSumPrice(amount: number): number;
    getSellMultiplier(): number;
    getSumPrice(amount: number): number;
    highets: number;
    icon: number;
    iconColumn: number;
    id: number;
    l: HTMLDivElement;
    level: number;
    levelAchiev10: any;
    levelTooltip(): string;
    levelUp(me: any): Function;
    locked: number;
    minigame: any;
    minigameLoaded: boolean;
    minigameName: number;
    minigameSave: number;
    minigameUrl: number;
    mouseOn: boolean;
    mousePos: [number, number];
    mute(): void;
    muted: number;
    n: number;
    name: string;
    onMinigame: boolean;
    pics: any[];
    plural: string;
    price: number;
    productionAchievs: any[];
    rebuild(): void;
    refresh(): void;
    sacrifice(amount: number): void;
    sell(amount: number, bypass: boolean): void;
    single: string;
    storedCps: number;
    storedTotalCps: number;
    switchMinigame(on: number): void;
    synergies: any[];
    tieredAchievs: any[];
    tieredUpgrades: any[];
    toResize: boolean;
    tooltip(): string;
    totalCookies: number;
    vanilla: number;
  }

  export interface Upgrade {
    baseDesc: string;
    basePrice: number;
    bought: number;
    buildingTie: any;
    buildingTie1: any;
    buildingTie2: any;
    buyFunction: Function;
    desc: string;
    icon: [number, number];
    iconFunction: number;
    id: number;
    kitten: number;
    name: string;
    order: number;
    parents: any[];
    pool: string;
    power: Function | number;
    priceLumps: number;
    techUnlock: any[];
    tier: number;
    type: string;
    unlockAt: number;
    unlocked: number;
    vanilla: number;
  }

  export interface Wrinkler {
    close: number;
    hp: number;
    hurt: number;
    id: number;
    phase: number;
    r: number;
    selected: number;
    sucked: number;
    type: number;
    x: number;
    y: number
  }
}