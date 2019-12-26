var getDefaultPlayer = () => ({
  lastUpdate: new Date().getTime(),
  clickOwned: new Decimal(0),
  coinOwned: new Decimal(0),
  get coinMult() {
    return player.rebirth.plus(1)
  },
  rebirth: new Decimal(0),
  get singleRebirthCost() {
    return player.rebirth.plus(1).times(10000)
  },
  get bulkRebirthAmount() {
    let bulk = new Decimal(0)
    do {
      if (player.coinOwned.gte(player.singleRebirthCost.times(Decimal.pow(bulk, 3)))) {
        bulk = bulk.plus(1)
      } else {
        break
      }
    } while (bulk.lt(100))
    return bulk.minus(1)
  },
  get bulkRebirthCost() {
    return player.singleRebirthCost.times(Decimal.pow(player.bulkRebirthAmount, 3))
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
  if (player.bulkRebirthAmount.gt(0)) {
    player.rebirth = player.rebirth.plus(player.bulkRebirthAmount)
    reset(1)
    return true
  }
  return false
}

function updateDisplay() {
  ue("clickOwned", nf(player.clickOwned))
  ue("coinOwned", nf(player.coinOwned))
  ue("clickCap", nf(player.clickCap))
  ue("clickGain", nf(player.clickGain))
  ue("sellAmt", coinOnSell())
  ;["cursor", "bag"].forEach(function(item) {
    de(`${item}UpgBtn`, player[`${item}Tier`] + 2 < window[`${item}Costs`].length)
    ue(`${item}Name`, tierNames[player[`${item}Tier`] + 1])
    ue(`${item}Cost`, nf(player[`${item}Cost`]))
    ue(`${item}Effect`, nf(window[`${item}Effects`][player[`${item}Tier`] + 1]))
  })
  ue("afterCoinMult", nf(player.coinMult.plus(Decimal.max(1, player.bulkRebirthAmount))))
  ue("rebirthCost", nf(player.bulkRebirthAmount.gt(0) ? player.bulkRebirthCost : player.singleRebirthCost))
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
