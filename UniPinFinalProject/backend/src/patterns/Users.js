class GuestUser {
    constructor(ipAddress, sessionToken) {
        this.ipAddress = ipAddress;
        this.sessionToken = sessionToken;
    }

    browseGames() {
        console.log(`[GuestUser] ${this.ipAddress} is browsing games.`);
    }

    checkout() {
        console.log(`[GuestUser] ${this.sessionToken} is checking out.`);
    }
}

class RegisteredUser {
    constructor(userId, email, loyaltyPoints) {
        this.userId = userId;
        this.email = email;
        this.loyaltyPoints = loyaltyPoints;
    }

    checkout() {
        console.log(`[RegisteredUser] ${this.email} is checking out. Loyalty points: ${this.loyaltyPoints}`);
    }
}

module.exports = { GuestUser, RegisteredUser };
