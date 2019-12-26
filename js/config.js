var cursorEffects = []
var cursorCosts = [new Decimal(0)]
var bagEffects = []
var bagCosts = [new Decimal(0)]
for (i = 0; i < 12; i++) {
  cursorEffects.push(Decimal.pow(2, i))
  bagEffects.push(Decimal.pow(2, 2 * i).times(10))
  if (i > 0) {
    cursorCosts.push(Decimal.pow(2, 2 * (i - 1)).times(20))
    bagCosts.push(Decimal.pow(2, 3 * (i - 1)).times(40))
  }
}
cursorEffects.push(new Decimal(0))
cursorCosts.push(new Decimal(1 / 0))
bagEffects.push(new Decimal(0))
bagCosts.push(new Decimal(0))
var tierNames = [
  "Normal",
  "Copper",
  "Silver",
  "Golden",
  "Diamond",
  "Platinum",
  "Obsidian",
  "Epic",
  "Holy",
  "Legendary",
  "Normal II",
  "Copper II",
  "Nonexistent"
]
