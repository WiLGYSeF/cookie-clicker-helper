function getAvailableUpgrades() {
  const eleUpgrades = document.getElementById('upgrades');
  const upgrades = [];

  for (const div of eleUpgrades.getElementsByClassName('upgrade')) {
    const match = div.onclick.toString().match(/Game.UpgradesById\[(\d+)\]/);
    upgrades.push(Game.UpgradesById[parseInt(match[1], 10)]);
  }
  return upgrades;
}

function getUpgradeEffect(upgrade) {
  // building upgrade
  if (upgrade.buildingTie === upgrade.buildingTie1) {
    return upgrade.buildingTie.cps(upgrade.buildingTie) * upgrade.buildingTie.amount;
  }
  // grandma upgrade
  if (upgrade.buildingTie instanceof Game.Object && upgrade.buildingTie1 === undefined) {
    const grandma = Game.Objects.Grandma;
    return grandma.cps(grandma) * grandma.amount;
  }
  // cookie upgrade
  if (upgrade.pool === 'cookie') {
    return Game.cookiesPs * (upgrade.power / 100);
  }
  // clicking upgrade
  if (upgrade.desc.includes('Clicking')) {
    // TODO: figure out value of clicking
  }
  // kitten upgrade
  if (upgrade.kitten === 1) {
    // TODO: figure out milk to cookies calculation
    // return Game.milkProgress;
  }
  return undefined;
}

function getUpgradeElement(upgrade) {
  const eleUpgrades = document.getElementById('upgrades');
  for (const div of eleUpgrades.getElementsByClassName('upgrade')) {
    const match = div.onclick.toString().match(/Game.UpgradesById\[(\d+)\]/);
    if (parseInt(match[1], 10) === upgrade.id) {
      return div;
    }
  }
  return null;
}

function borderBestUpgrade() {
  return setInterval(() => {
    const upgrades = getAvailableUpgrades().map(
      (x) => [x, getUpgradeEffect(x) / x.basePrice || 0],
    );
    upgrades.sort((a, b) => b[1] - a[1]);

    const colors = ['#00ff00', '#ffff00', '#ffa600'];
    const unknownColor = '#0000bb';
    let cidx = 0;

    for (const upgrade of upgrades) {
      const eleUpgrade = getUpgradeElement(upgrade[0]);
      if (eleUpgrade !== null) {
        if (upgrade[1] !== 0) {
          eleUpgrade.style.backgroundColor = cidx === colors.length ? '' : colors[cidx++];
        } else {
          eleUpgrade.style.backgroundColor = unknownColor;
        }
      }
    }
  }, 150);
}

module.exports = {
  borderBestUpgrade,
};
