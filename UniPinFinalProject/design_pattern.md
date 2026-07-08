# Design Patterns Used in UniPin Top-Up System

This document provides a simple, easy-to-understand explanation of the 6 core software design patterns used in our backend architecture. Each pattern was chosen to solve a specific problem in processing game top-ups.

---

### 1. Singleton Pattern
**What it is:** A pattern that ensures a class has only one instance and provides a global point of access to it.
**Where it's used:** `GameCatalog.js`
**Why we used it:** 
When the server starts, we load all the games (like Mobile Legends, PUBG) and their pricing packages from the database into memory. We only want **one single catalog** to exist so we aren't constantly querying the database every time a user views the website. Singleton guarantees all users are seeing the exact same loaded game catalog.

---

### 2. Builder Pattern
**What it is:** A pattern that allows constructing complex objects step-by-step.
**Where it's used:** `OrderBuilder.js`
**Why we used it:** 
Creating a top-up order requires many different pieces of information: the game code, the player ID, the zone ID, the package they chose, the base price, and any promo code discounts. Instead of a massive, confusing constructor like `new Order(a, b, c, d, e, f)`, the Builder lets us chain readable steps:
```javascript
new OrderBuilder()
    .setGameCode('MLBB')
    .setPlayer('12345678', '1234')
    .setPackage('PKG_1', 100, 1.50)
    .applyPromoCode(10)
    .build();
```

---

### 3. Abstract Factory Pattern
**What it is:** An interface for creating families of related or dependent objects without specifying their concrete classes.
**Where it's used:** `PaymentGatewayFactory.js`
**Why we used it:** 
We support different payment banks (ABA Pay and ACLEDA). Each bank needs a different way to **process payments** and a different way to **generate receipts**. The Abstract Factory ensures that if a user selects ABA, they get an ABA Payment Handler AND an ABA Receipt Generator. It groups related payment logic together perfectly.

---

### 4. Strategy Pattern
**What it is:** Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
**Where it's used:** `PaymentStrategy.js`
**Why we used it:** 
The main checkout system (`index.js`) doesn't care *how* a payment is processed. It just wants to call `processPayment()`. By using the Strategy pattern, we can instantly swap out the ABA payment logic for ACLEDA payment logic at runtime depending on what the user clicked. The checkout system stays clean and completely unaware of bank-specific code.

---

### 5. State Pattern
**What it is:** Allows an object to alter its behavior when its internal state changes.
**Where it's used:** `TopUpOrderState.js`
**Why we used it:** 
An order goes through a strict lifecycle: `Pending` ➔ `Paid` ➔ `Completed` (or `Failed`). The State pattern prevents illegal actions. For example, if an order is already in the `Completed` state, the pattern physically prevents the system from calling `.pay()` on it again. This is a critical security measure to prevent double-charging or duplicate diamond deliveries.

---

### 6. Facade Pattern
**What it is:** Provides a simplified, unified interface to a larger, complex body of code.
**Where it's used:** `PublisherFacade.js`
**Why we used it:** 
Verifying player IDs and delivering diamonds is extremely complex because every game publisher (Moonton, HoYoverse, Tencent) has a completely different API, different URL endpoints, and different authentication methods.
The Facade hides all this messy complexity behind two simple methods: `validatePlayer()` and `deliverCurrency()`. The rest of our backend just talks to the Facade, and the Facade does all the hard work of translating that request to the correct publisher API.
