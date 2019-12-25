var getDefaultPlayer = () => ({
  lastUpdate: new Date().getTime(),
  clickOwned: new Decimal(0),
  coinOwned: new Decimal(0),
  bagLevel: 0,
  cursorLevel: 0,
  get clickCap() {
    let bagCaps = [10, 40, 160, 640, 2560, 10240, 40960, 163840, 655360]
    return new Decimal(bagCaps[this.bagLevel])
  },
  get clickGain() {
    let cursorGains = [1, 2, 4, 8, 16, 32, 64, 128, 256]
    return new Decimal(cursorGains[this.cursorLevel])
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
  return player.clickOwned
}

function updateDisplay() {
  ue("clickOwned", player.clickOwned)
  ue("coinOwned", player.coinOwned)
  ue("clickCap", player.clickCap)
  ue("clickGain", player.clickGain)
  ue("sellAmt", coinOnSell())
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
}

function startGame() {
  hookAllOnclick()
  startInterval()
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop, 33)
}
