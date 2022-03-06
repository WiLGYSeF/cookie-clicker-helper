declare const Game: CookieClicker.Game;

export const garden = Game.ObjectsById[2].minigame;

export function harvestEol(): number {
  const harvestIntv = 30 * 1000;
  return setInterval(() => {
    const now = new Date();
    if (garden.nextStep - now.getTime() > harvestIntv) {
      return;
    }

    for (const row of garden.plot) {
      for (const tile of row) {
        if (tile[0] === 0) {
          continue;
        }

        console.log(garden.plantsById[tile[0] - 1]);
      }
    }
  }, harvestIntv);
}
