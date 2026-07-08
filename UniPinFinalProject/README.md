# UniPin Top-Up System - Design Patterns Documentation

This document explains the various software design patterns implemented in the UniPin Final Project. The patterns are utilized across both the frontend and backend to ensure the codebase is scalable, maintainable, and robust.

## Creational Patterns

### 1. Singleton Pattern
- **Locations:** 
  - `backend/src/patterns/GameCatalog.js`
  - `frontend/src/patterns/GameCatalog.ts`
- **Purpose:** The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.
- **How it's used:** `GameCatalog` acts as a single centralized repository and source-of-truth for all games, packages, and admin-managed promotional codes. By making it a singleton, we prevent duplicate data loading and ensure that changes (like adding a new promo code) are reflected system-wide immediately.

### 2. Builder Pattern
- **Locations:**
  - `backend/src/patterns/OrderBuilder.js`
  - `frontend/src/patterns/OrderBuilder.ts`
- **Purpose:** The Builder pattern is used to construct complex objects step-by-step. It separates the construction of a complex object from its representation.
- **How it's used:** When a user creates a `TopUpOrder`, they need to specify the game, player ID, zone ID, selected package, and potentially apply a promo code. The `OrderBuilder` provides a fluent interface (chaining methods like `setGameCode().setPlayer().setPackage().build()`) to cleanly assemble this object without requiring a massive, confusing constructor.

### 3. Abstract Factory Pattern
- **Locations:**
  - `backend/src/patterns/PaymentStrategy.js`
  - `frontend/src/patterns/PaymentGatewayFactory.ts`
- **Purpose:** The Abstract Factory pattern lets you produce families of related or dependent objects without specifying their concrete classes.
- **How it's used:** Different payment gateways require different processing strategies and different receipt formats. Factories like `ABAPayFactory` and `ACLEDAPayFactory` implement a common interface to create a matching pair of a `PaymentStrategy` (for handling the transaction) and a `ReceiptGenerator` (for generating the corresponding receipt format). This guarantees the payment algorithm and receipt always match.

## Structural Patterns

### 4. Facade Pattern
- **Location:**
  - `backend/src/patterns/PublisherFacade.js`
- **Purpose:** The Facade pattern provides a simplified interface to a library, a framework, or any other complex set of classes.
- **How it's used:** The system integrates with multiple game publishers (Moonton, Tencent, HoYoverse, etc.), each having their own unique API for validating players and delivering currency. The `PublisherFacade` hides this complexity behind a single, unified interface (`validatePlayer`, `deliverCurrency`). The core order processing system only interacts with the Facade, making it completely unaware of the individual publisher's underlying complexities.

## Behavioral Patterns

### 5. Strategy Pattern
- **Locations:**
  - `backend/src/patterns/PaymentStrategy.js`
  - `frontend/src/patterns/PaymentStrategy.ts`
- **Purpose:** The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.
- **How it's used:** The system supports multiple payment methods (ABA Pay, ACLEDA, E-Wallet). Each payment method encapsulates its own processing logic in a separate strategy class (`ABAPayStrategy`, `ACLEDAPayStrategy`). A `PaymentProcessor` context uses the currently selected strategy to process payments, allowing new payment methods to be added easily without modifying existing code.

### 6. State Pattern
- **Location:**
  - `backend/src/patterns/OrderState.js`
- **Purpose:** The State pattern allows an object to alter its behavior when its internal state changes.
- **How it's used:** A top-up order has a strict lifecycle. It goes from `Pending` → `Paid` → `Completed` or `Failed`. The `OrderState` classes dictate the behavior at each step. For example, if an order is in the `PaidState`, attempting to call `pay()` again will be safely rejected, and calling `deliver()` will transition it to `CompletedState`. This completely eliminates complex `if/else` checks for the order's status and prevents invalid state transitions.
