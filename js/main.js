var getDefaultPlayer = () => ({
  lastUpdate: new Date().getTime(),
  clickOwned: new Decimal(0),
  coinOwned: new Decimal(0),
  get coinMult() {
    return player.rebirth.plus(1)
  },
  rebirth: new Decimal(0),
  get rebirthCost() {
    return player.rebirth.plus(1).times(10000)
  },
  bagTier: 0,
  cursorTier: 0,
  get clickCap() {
    return new Decimal(bagEffects[this.bagTier])
  },
  get clickGain() {
    return new Decimal(cursorEffects[this.cursorTier])
  },
  get bagCost() {
    return new Decimal(bagCosts[player.bagTier + 1])
  },
  get cursorCost() {
    return new Decimal(cursorCosts[player.cursorTier + 1])
  }
})
var player = getDefaultPlayer()
var diffMultiplier = 1
let gameLoopIntervalId = 0

function click() {
  player.clickOwned = Decimal.min(player.clickCap, player.clickOwned.plus(player.clickGain))
}

function sellClicks() {
  player.coinOwned = player.coinOwned.plus(coinOnSell())
  player.clickOwned = new Decimal(0)
}

function coinOnSell() {
  let ret = player.clickOwned
  ret = ret.times(player.coinMult)
  return ret
}

function upgradeItem(type) {
  if (player.coinOwned.gte(player[`${type}Cost`])) {
    player.coinOwned = player.coinOwned.sub(player[`${type}Cost`])
    player[`${type}Tier`]++
    return true
  }
  return false
}

function reset(tier) {
  let resetOnTier = [["clickOwned", "coinOwned", "bagTier", "cursorTier"]]
  let toReset = [].concat.apply([], resetOnTier.slice(0, tier))
  resetValues(toReset)
}

function rebirth() {
  if (player.coinOwned.gte(player.rebirthCost)) {
    reset(1)
    player.rebirth = player.rebirth.plus(1)
    return true
  }
  return false
}

function updateDisplay() {
  ue("clickOwned", player.clickOwned)
  ue("coinOwned", player.coinOwned)
  ue("clickCap", player.clickCap)
  ue("clickGain", player.clickGain)
  ue("sellAmt", coinOnSell())
  ;["cursor", "bag"].forEach(function(item) {
    ue(`${item}Name`, tierNames[player[`${item}Tier`] + 1])
    ue(`${item}Cost`, player[`${item}Cost`])
    ue(`${item}Effect`, window[`${item}Effects`][player[`${item}Tier`] + 1])
  })
  ue("afterCoinMult", player.coinMult.plus(1))
  ue("rebirthCost", player.rebirthCost)
}

function gameLoop() {
  // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  if (typeof diff === "undefined") var diff = Math.min(thisUpdate - player.lastUpdate, 21600000)
  diff *= diffMultiplier
  if (diffMultiplier > 1) console.log("SHAME")
  else if (diffMultiplier < 1) console.log("SLOWMOTION")

  updateDisplay()
}

function hookAllOnclick() {
  hookOnclick("clickBtn", click)
  hookOnclick("sellBtn", sellClicks)
  hookOnclick("cursorUpgBtn", () => upgradeItem("cursor"))
  hookOnclick("bagUpgBtn", () => upgradeItem("bag"))
  hookOnclick("rebirthBtn", rebirth)
}

function startGame() {
  hookAllOnclick()
  startInterval()
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop, 33)
}
