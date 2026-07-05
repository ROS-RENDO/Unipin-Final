export class GuestUser {
  constructor(userId) {
    this.userId = userId;
  }

  browseCatalog() {
    // implementation
  }

  validateGameId() {
    // implementation
  }
}

export class RegisteredUser extends GuestUser {
  constructor(userId, email, loyaltyPoints = 0) {
    super(userId);
    this.email = email;
    this.loyaltyPoints = loyaltyPoints;
  }

  checkout() {
    // implementation
  }
}

export class Admin extends GuestUser {
  constructor(userId, email, passwordHash) {
    super(userId);
    this.email = email;
    this.passwordHash = passwordHash;
  }

  managePromotions() {
    // implementation
  }

  reconcileFailedTransactions() {
    // implementation
  }

  manageCatalog() {
    // implementation
  }
}
