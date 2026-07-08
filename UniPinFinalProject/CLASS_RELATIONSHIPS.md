# UniPin System - Class Relationships and Architecture

This document details the class relationships and architectural connections across the UniPin system. Understanding these relationships (Composition, Aggregation, Inheritance, and Dependencies) is critical for interpreting the system's Class Diagram.

---

## 1. Core Domain: Game Catalog System
This subsystem is responsible for managing the available games, their purchasable packages, and promotional codes.

* **`GameCatalog` (Singleton)**
  * **Composition (Has-A):** The `GameCatalog` maintains a list of `Game` objects and a dictionary of `PromoCode` objects. If the catalog is destroyed, the instances of games and promo codes it holds go with it.
  * **Instantiation:** It acts as a Singleton, providing a `.getInstance()` method ensuring only one `GameCatalog` exists in memory.

* **`Game`**
  * **Composition (Has-A):** A `Game` object contains a list of `Package` objects. A package (e.g., "60 Diamonds") cannot exist independently without belonging to a specific game.

* **`Package` & `PromoCode`**
  * These act as basic entity classes (data containers) managed by the `GameCatalog` and `Game`.

---

## 2. Order Management System
This subsystem handles the creation and lifecycle of a user's top-up request.

* **`OrderBuilder` & `TopUpOrder` / `BuiltOrder`**
  * **Dependency (Creates):** The `OrderBuilder` depends on the `TopUpOrder` (or `BuiltOrder` in the backend). The Builder's sole responsibility is to instantiate, configure step-by-step, and eventually return a fully constructed `TopUpOrder` object.

* **`TopUpOrder` & `OrderState`**
  * **Aggregation/State Pattern (Has-A):** A `TopUpOrder` maintains a reference to an `OrderState` object, representing its current state in the lifecycle.
  * **Delegation:** The `TopUpOrder` delegates state-specific behaviors (like `pay()` and `deliver()`) to its current `OrderState` instance.

* **`OrderState` (Abstract Class/Interface)**
  * **Inheritance (Is-A):** `PendingState`, `PaidState`, `CompletedState`, and `FailedState` all inherit from (or implement) `OrderState`. They provide the concrete logic for how an order behaves in that specific state.

* **`TopUpOrder` & `Transaction`**
  * **Composition (Has-A):** A `TopUpOrder` maintains a history array of `Transaction` objects. A transaction belongs to an order and records payment attempts.

---

## 3. Payment Processing System
This subsystem manages the dynamic routing of payments to various gateways and generating receipts.

* **`PaymentProcessor` (Context) & `PaymentStrategy`**
  * **Aggregation (Has-A):** The `PaymentProcessor` contains a reference to a `PaymentStrategy`. 
  * **Delegation:** When `processPayment()` is called on the processor, it delegates the actual execution to the underlying strategy.

* **`PaymentStrategy` (Interface)**
  * **Implementation (Is-A):** `ABAPayStrategy`, `ACLEDAPayStrategy`, and `EWalletStrategy` implement the `PaymentStrategy` interface. They define the specific API calls required for their respective banks/gateways.

* **`PaymentGatewayFactory` (Abstract Factory Interface)**
  * **Implementation (Is-A):** `ABAPayFactory` and `ACLEDAPayFactory` implement this interface.
  * **Dependency (Creates):** These concrete factories are responsible for instantiating the correct, matching families of objects. For example, `ABAPayFactory` creates an `ABAPayStrategy` and an `ABAReceiptGenerator`. 

* **`ReceiptGenerator` (Interface)**
  * **Implementation (Is-A):** `ABAReceiptGenerator` and `ACLEDAReceiptGenerator` implement this interface to output gateway-specific receipt formats.

---

## 4. Publisher Integration System
This subsystem abstracts the communication with third-party game servers (like Moonton or Tencent) to validate players and deliver in-game currency.

* **`PublisherFacade`**
  * **Composition (Has-A):** The Facade maintains a mapping (dictionary) of game codes to specific `GamePublisherAPI` instances. 
  * **Delegation:** When the system asks the Facade to `validatePlayer("MLBB", ...)`, the Facade looks up the `MoontonAPI` instance and delegates the request to it.

* **`GamePublisherAPI` (Abstract Class/Interface)**
  * **Inheritance/Implementation (Is-A):** `MoontonAPI`, `TencentAPI`, `HoYoverseAPI`, and `GenericPublisherAPI` implement the `GamePublisherAPI` interface. They translate the system's standard requests into the proprietary API format required by the respective game publishers.

---

## Summary of Key Relationships for Diagramming

1. **Inheritance (Solid line with hollow arrow):** 
   - `ABAPayStrategy` → `PaymentStrategy`
   - `MoontonAPI` → `GamePublisherAPI`
   - `PendingState` → `OrderState`
2. **Composition (Solid line with filled diamond):** 
   - `GameCatalog` ♦— `Game`
   - `Game` ♦— `Package`
   - `TopUpOrder` ♦— `Transaction`
3. **Aggregation (Solid line with hollow diamond):** 
   - `PaymentProcessor` ♢— `PaymentStrategy`
   - `TopUpOrder` ♢— `OrderState`
4. **Dependency (Dashed line with open arrow):** 
   - `OrderBuilder` ⇢ `TopUpOrder`
   - `ABAPayFactory` ⇢ `ABAPayStrategy`
