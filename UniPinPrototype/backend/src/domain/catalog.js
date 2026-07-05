export class GameCatalog {
  constructor(gameCode, gameName, basePrice, active) {
    this.gameCode = gameCode;
    this.gameName = gameName;
    this.basePrice = basePrice;
    this.active = active;
  }

  updatePrice(newPrice) {
    this.basePrice = newPrice;
  }
}

export class GamePromotion {
  constructor(promoCode, gameCode, discountPercentage, active) {
    this.promoCode = promoCode;
    this.gameCode = gameCode;
    this.discountPercentage = discountPercentage;
    this.active = active;
  }

  isApplicable(gameCode) {
    return this.active && this.gameCode === gameCode;
  }
}
