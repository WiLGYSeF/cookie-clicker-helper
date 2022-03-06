# Cookie Clicker Helper

[https://orteil.dashnet.org/cookieclicker/](https://orteil.dashnet.org/cookieclicker/)

Helps you play cookie clicker by giving information on purchases.
Will also click golden cookies for you.

Last tested for version v. 2.031.

# Usage

1. Install npm dependencies:
  ```bash
  npm install
  ```
2. Webpack the scripts:
  ```bash
  npm run build
  ```
3. Copy the contents of `dist/cookie.js` into the web console on the Cookie Clicker page.

# Features

- Highlights most cost-efficient buildings and upgrades in order of green, yellow, and orange.
  - Blue highlights mean that the helper does not know how effective the purchase is.
- Adds a cost in time to the buying buildings and upgrades tooltip using raw cookies per second.
- Adds a numerical value between 0 and 1, calculated by `production / cost`, for buying buildings and upgrades in the tooltip.
- Adds a timer to the **Legacy** tooltip until the next level.
- Display the total wrinklers' cookie yield.
- Adds an approximate refill timer to the magic meter tooltip.
- Clicks on Golden cookies/Reindeer.
  - Will click on the big cookie if a golden cookie yields a buff.

# ToDo

- Click on sugar lumps when they're ready
- Auto-harvest garden plants
