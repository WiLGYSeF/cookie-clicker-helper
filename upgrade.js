function getUpgradeElements() {
  const eleUpgrades = document.getElementById('upgrades');
  const eleTechUpgrades = document.getElementById('techUpgrades');
  const elements = [];

  elements.push(...eleUpgrades.getElementsByClassName('upgrade'));
  elements.push(...eleTechUpgrades.getElementsByClassName('upgrade'));
  return elements;
}

function getAvailableUpgrades() {
  const upgrades = [];
  for (const div of getUpgradeElements()) {
    const match = div.onclick.toString().match(/Game.UpgradesById\[(\d+)\]/);
    upgrades.push(Game.UpgradesById[parseInt(match[1], 10)]);
  }
  return upgrades;
}

function getUpgradeElement(upgrade) {
  for (const div of getUpgradeElements()) {
    const match = div.onclick.toString().match(/Game.UpgradesById\[(\d+)\]/);
    if (match && parseInt(match[1], 10) === upgrade.id) {
      return div;
    }
  }
  return null;
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

  // Thousand fingers upgrade
  if (upgrade.name === 'Thousand fingers') {
    const cursors = Game.Objects.Cursor.amount;
    const nonCursorBuildings = Game.BuildingsOwned - cursors;
    return nonCursorBuildings * (cursors / 100);
  }

  // Thousand fingers upgrades
  const multGain1000FingersMatch = (
    upgrade.name === 'Thousand fingers' ? [null, '1'] : upgrade.desc.match(new RegExp(
      'Multiplies the gain from Thousand fingers by <b>(\\d+)</b>',
    ))
  );
  if (multGain1000FingersMatch) {
    // TODO: factor in clicking for calculation
    const cursors = Game.Objects.Cursor.amount;
    const nonCursorBuildings = Game.BuildingsOwned - cursors;
    return nonCursorBuildings * (cursors / 100) * parseInt(multGain1000FingersMatch[1], 10);
  }

  if (upgrade.pool === 'tech') {
    const match = upgrade.desc.match(new RegExp('Cookie production multiplier <b>\\+(\\d+)%</b>'));
    if (match) {
      return Game.cookiesPs * (parseInt(match[1], 10) / 100);
    }
  }
  return undefined;
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
