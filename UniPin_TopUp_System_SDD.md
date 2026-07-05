# FESE306 – Software Modeling & Design
## Final Project: Software Design Document (SDD)
**Project Name:** UniPin Game Top-Up System
**Team Members:** Kuy Visal, Kouch Bunpor, Ny Sihac, Rous Rendo
**Instructor:** Pen Voneat

---

## 1. Project Scenario & Overview

The **UniPin Game Top-Up System** acts as a centralized digital goods aggregator bridging Gamers, Payment Gateways, and Game Publishers.
- **Customers (Gamers)** browse catalogs, validate their game IDs, apply promotional discounts, and purchase in-game currency directly through the UniPin web portal.
- **UniPin System Admin** manages the game catalog, updates pricing, and creates promotional campaigns.
- The system handles real-time validation of Game IDs, processes payments through multiple channels (e.g., Credit Card, E-Wallets, Bank Transfers), and instantly fulfills orders via integrations with external **Game Publishers** (like Moonton, Tencent).
- The system includes robust failure handling, automatically rolling back and refunding transactions if a Game Publisher API times out.

---

## 2. UML Diagrams — Full Suite

### 2.1 Use Case Diagram
**Actors:** Customer (Gamer), UniPin Admin, Game Publisher API, Payment Gateway.
**Use Cases:** Browse Game Catalog, Validate Game ID, Purchase Game Credits, Apply Promo Code, Manage Catalog & Promos, Reconcile Transactions.

```mermaid
flowchart LR
    %% Actors
    Customer["Customer (Gamer)"]
    Admin["UniPin Admin"]
    GameAPI["Game Publisher API"]
    PayGateway["Payment Gateway"]

    %% System Boundary
    subgraph UniPin_TopUp_System ["UniPin Top-Up System"]
        UC_Browse(["Browse Game Catalog"])
        UC_Validate(["Validate Game ID"])
        UC_Promo(["Apply Promo Code"])
        UC_Purchase(["Purchase Game Credits"])
        UC_ManageCatalog(["Manage Catalog & Promos"])
        UC_Reconcile(["Reconcile Failed Transactions"])
    end

    %% Associations
    Customer --> UC_Browse
    Customer --> UC_Validate
    Customer --> UC_Promo
    Customer --> UC_Purchase
    
    Admin --> UC_ManageCatalog
    Admin --> UC_Reconcile
    
    UC_Validate --> GameAPI
    UC_Purchase --> PayGateway
    UC_Purchase --> GameAPI
```

### 2.2 Class Diagram
This class diagram illustrates the full system model, incorporating the design patterns used for payment strategies, Publisher API facades, state management, notifications, and factory creation.

```mermaid
classDiagram
    %% ── USER HIERARCHY ──────────────────────────────
    class GuestUser {
        +int userId
        +browseCatalog() void
        +validateGameId() void
    }

    class RegisteredUser {
        +int userId
        +String email
        +int loyaltyPoints
        +checkout() void
    }

    class Admin {
        +int userId
        +String email
        +String passwordHash
        +managePromotions() void
        +reconcileFailedTransactions() void
        +manageCatalog() void
    }

    %% ── GAME CATALOG & PROMOTION ────────────────────
    class GameCatalog {
        +String gameCode
        +String gameName
        +number basePrice
        +bool active
        +updatePrice() void
    }

    class GamePromotion {
        +String promoCode
        +String gameCode
        +double discountPercentage
        +bool active
        +isApplicable() bool
    }

    GuestUser "0..*" --> "8..7" GameCatalog : Browse
    GameCatalog "1" --> "0..*" GamePromotion : Offers
    GamePromotion ..> GameCatalog : apply

    %% ── ORDER — Factory + State + Template ──────────
    class OrderFactory {
        +createOrder() TopUpOrder
    }

    class TopUpOrder {
        <<abstract>>
        +String orderId
        +String playerId
        +String zoneId
        +String gameCode
        +double baseAmount
        +OrderStatus status
        +setState(newState OrderState) void
        +pay() void
        +deliver(success bool) void
        +cancelAndRefund() void
        +getFinalPrice() double
    }

    class StandardOrder {
        +getFinalPrice() double
    }

    class PromoOrder {
        +String promoCode
        +double discountPercentage
        +getFinalPrice() double
    }

    class OrderType {
        <<enumeration>>
        Standard
        Promo
    }

    class OrderStatus {
        <<enumeration>>
        Created
        PendingPayment
        ProcessingDelivery
        Completed
        Failed
    }

    TopUpOrder <|-- StandardOrder
    TopUpOrder <|-- PromoOrder
    OrderFactory ..> TopUpOrder : create as
    RegisteredUser "1" --> "0..*" TopUpOrder : Places

    %% ── STATE PATTERN ───────────────────────────────
    class OrderState {
        <<interface>>
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    class CreatedState {
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    class ProcessingDeliveryState {
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    class CompletedState {
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    class FailedState {
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    OrderState <|.. CreatedState
    OrderState <|.. ProcessingDeliveryState
    OrderState <|.. CompletedState
    OrderState <|.. FailedState
    TopUpOrder "1" --> "1" OrderState

    %% ── PAYMENT — Strategy Pattern ──────────────────
    class PaymentProcessor {
        <<Service>>
        +strategy PaymentStrategy
        +setStrategy(strategy paymentMethod) void
        +processPayment(amount) bool
        +refund(orderId String, amount double) bool
    }

    class PaymentStrategy {
        <<interface>>
        +pay(amount) bool
        +getName() String
    }

    class CreditCardStrategy {
        +pay(amount) bool
        +getName() String
    }

    class BankTransferStrategy {
        +pay(amount) bool
        +getName() String
    }

    class PaymentGateway {
        <<interface>>
        +charge(orderId, amount, method) void
        +refund(orderId, amount) void
    }

    class PaymentMethod {
        <<enumeration>>
        Creditcard
        BankTransfer
    }

    PaymentStrategy <|.. CreditCardStrategy
    PaymentStrategy <|.. BankTransferStrategy
    PaymentProcessor "1" --> "1" PaymentStrategy : choose
    PaymentProcessor ..> PaymentGateway : pay/refund
    TopUpOrder "1" --> "1" PaymentProcessor : has

    %% ── DELIVERY — Facade Pattern ───────────────────
    class PublisherFacade {
        +validatePlayer(gameCode, PlayerId, zoneId) void
        +deliverCurrency(gameCode, playerId, amount, zoned) void
    }

    class GamePublisherAPI {
        <<interface>>
        +getServerList(gameCode) void
        +verify(playerId, zoneID) void
        +checkout(orderId, amount) void
        +deliver(orderId, amount) void
    }

    TopUpOrder ..> PublisherFacade : validate/deliver
    PublisherFacade ..> GamePublisherAPI : Call Publisher Endpoints
```



### 2.3 Sequence Diagrams (3 Flows)

#### Sequence 1: Direct Purchase Flow (Standard Order)
*A Customer selects a game, validates their ID, and pays via a payment gateway. UniPin delivers the goods.*

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Portal as UniPin Portal
    participant OrderFac as Order Factory
    participant PubFacade as Publisher Facade
    participant PayGateway as Payment Gateway
    participant GameAPI as Game Publisher

    Customer->>Portal: Enter Player ID & Zone ID
    Portal->>PubFacade: validatePlayer(ID, Zone)
    PubFacade->>GameAPI: API Check User
    GameAPI-->>PubFacade: Valid User (Nickname)
    PubFacade-->>Portal: Display Nickname

    Customer->>Portal: Checkout & Pay (Credit Card)
    Portal->>OrderFac: createOrder("Standard")
    OrderFac-->>Portal: StandardOrder (State: Created)
    
    Portal->>PayGateway: Process Payment
    PayGateway-->>Portal: Payment Success
    
    Portal->>PubFacade: deliverCurrency()
    PubFacade->>GameAPI: API Credit Currency
    GameAPI-->>PubFacade: Delivery Success
    PubFacade-->>Portal: Order Complete
    Portal-->>Customer: Display Digital Receipt
```

#### Sequence 2: Apply Promotion & Checkout
*A Customer applies a promo code. The system creates a `PromoOrder` which calculates a discounted final price.*

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Portal as UniPin Portal
    participant OrderFac as Order Factory
    participant Order as PromoOrder
    participant PayGateway as Payment Gateway

    Customer->>Portal: Enter Promo Code "WELCOME20"
    Portal->>OrderFac: createOrder("Promo", code="WELCOME20")
    OrderFac-->>Portal: PromoOrder (State: Created)
    
    Portal->>Order: getFinalPrice()
    Order-->>Portal: Returns Discounted Amount (-20%)
    
    Customer->>Portal: Confirm Payment
    Portal->>PayGateway: Process Discounted Amount
    PayGateway-->>Portal: Payment Success
```

#### Sequence 3: Payment Failure & Auto-Refund
*A game publisher's API times out during delivery. UniPin transitions the order to Failed and issues a refund.*

```mermaid
sequenceDiagram
    autonumber
    participant Portal as UniPin Portal
    participant Order as TopUp Order
    participant State as OrderState (Failed)
    participant PubFacade as Publisher Facade
    participant GameAPI as Game Publisher
    participant PayGateway as Payment Gateway
    participant Notifier as Notification Engine

    Portal->>PubFacade: deliverCurrency()
    PubFacade->>GameAPI: API Credit Currency
    GameAPI-->>PubFacade: ERROR 504 (Timeout)
    
    PubFacade-->>Portal: Delivery Exception
    Portal->>Order: cancelAndRefund()
    Order->>State: handle(Order)
    State-->>Order: Update State to 'Failed'
    
    Order->>PayGateway: Initiate Refund
    PayGateway-->>Order: Refund Success
    
    Order->>Notifier: notify("Order_Failed")
    Notifier->>Portal: Push Notification: "Delivery failed, refund issued"
```

### 2.4 Activity Diagram
*The complete logic workflow for processing a top-up request to completion.*

```mermaid
flowchart TD
    Start([Start Top-Up Process]) --> ValidateID[Validate Player ID via Publisher API]
    
    ValidateID --> IDValid{Is ID Valid?}
    IDValid -->|No| RejectID([Reject - Invalid Player ID])
    IDValid -->|Yes| ApplyPromo[Customer Applies Promo Code?]
    
    ApplyPromo -->|Yes| CalcDiscount[Calculate Discounted Price]
    ApplyPromo -->|No| CalcStandard[Calculate Standard Price]
    
    CalcDiscount --> ProcessPay[Process Payment]
    CalcStandard --> ProcessPay
    
    ProcessPay --> PaySuccess{Payment Success?}
    
    PaySuccess -->|No| CancelOrder([Cancel Order])
    PaySuccess -->|Yes| UpdateState[Update Order State: Processing]
    
    UpdateState --> CallPublisher[Call Publisher API to Deliver Currency]
    CallPublisher --> DeliveryCheck{Delivery Success?}
    
    DeliveryCheck -->|No| Refund[Trigger Refund] --> FailState([Mark as Failed])
    DeliveryCheck -->|Yes| CompleteState[Update Order State: Completed]
    
    CompleteState --> Notify[Send Receipt Notification]
    Notify --> End([End Workflow])
```

### 2.5 State Diagram
*State machine for the Order lifecycle.*

```mermaid
stateDiagram-v2
    [*] --> Created : Order initiated
    
    Created --> Pending_Payment : Awaiting user payment
    Created --> Cancelled : User abandoned cart
    
    Pending_Payment --> Processing_Delivery : Payment confirmed (Gateway)
    Pending_Payment --> Failed : Payment rejected
    
    Processing_Delivery --> Completed : Publisher API confirmed delivery
    Processing_Delivery --> Failed : Publisher API timeout / error
    
    Failed --> [*] : Refund Processed
    Completed --> [*] : Transaction Closed
    Cancelled --> [*] 
```

---

## 3. Design Pattern Application

We have applied 5 design patterns to solve specific architectural problems in the UniPin System.

| Pattern | Category | Problem Solved | Location in Class Diagram | Why Chosen |
| :--- | :--- | :--- | :--- | :--- |
| **1. Facade Pattern** | Structural | UniPin connects to dozens of different Game Publishers (Moonton, Tencent, Garena), all with entirely different API structures and security headers. The core system shouldn't know these details. | `PublisherFacade` class. It shields the `TopUpOrder` from the complexity of external `GamePublisherAPI`s. | Chosen over direct API calls in the Order class to ensure loose coupling. When a new game is added, we only update the Facade. |
| **2. Strategy Pattern** | Behavioral | Top-ups can be paid for via Credit Cards, E-Wallets, or Bank Transfers. Writing `if/else` for every payment method makes checkout rigid. | `PaymentProcessor` uses the `PaymentStrategy` interface, implemented by `CreditCardStrategy` and `BankTransferStrategy`. | Chosen over inheritance because payment methods are interchangeable behaviors at runtime. It perfectly adheres to the Open/Closed Principle. |
| **3. State Pattern** | Behavioral | Orders have a strict lifecycle. State transitions require complex validation (e.g., you cannot refund an order that is still in `Created` state). | `OrderState` interface and concrete classes (`CreatedState`, `ProcessingDeliveryState`, `CompletedState`, `FailedState`). | Chosen over massive switch statements inside the `TopUpOrder` class. Each state handles its own transition logic securely. |
| **4. Observer Pattern** | Behavioral | When an order succeeds or fails, multiple independent subsystems (Email service, In-App Push service) need to react instantly. | `NotificationEngine` (Subject) and `Observer` interface implemented by `EmailReceiptNotifier` and `AppPushNotifier`. | Chosen because it allows UniPin to add new notification methods (like SMS alerts) without modifying the core `Order` transactional logic. |
| **5. Factory Method** | Creational | We have two distinct types of checkout flows: Standard purchases (`StandardOrder`) and purchases with discounts applied (`PromoOrder`) which require different price calculation algorithms. | `OrderFactory` class with `createOrder()` which produces a `TopUpOrder` subclass. | Chosen over direct instantiation (`new StandardOrder()`) to centralize the complex creation logic and cleanly separate standard pricing from promotional pricing. |

---

## 4. Layered Architecture Diagram

The system employs a strict 4-Tier Layered Architecture separating concerns from user interaction down to data storage.

```mermaid
flowchart TD
    subgraph Presentation Layer [1. Presentation Layer / Web UI]
        WebPortal[UniPin Web Portal React App]
    end

    subgraph Business Logic Layer [2. Business Logic Layer]
        OrderController[Top-Up Controller]
        PaymentProcessor[Payment Processor / Strategies]
        PublisherFacade[Publisher Integration Facade]
        NotificationEngine[Notification Engine / Observers]
        OrderFactory[Order Factory & State]
    end

    subgraph Data Access Layer [3. Data Access Layer]
        UserRepository[Customer Repository]
        OrderRepository[Order Repository]
        CatalogRepository[Game Catalog Repository]
    end

    subgraph Database Layer [4. Database Layer]
        PostgreSQL[(PostgreSQL Relational DB)]
        Redis[(Redis Cache for Catalog/Sessions)]
    end

    %% Mapping connections
    WebPortal --> OrderController
    
    OrderController --> OrderFactory
    OrderController --> PublisherFacade
    OrderController --> PaymentProcessor
    
    OrderFactory --> NotificationEngine
    
    OrderFactory --> OrderRepository
    PaymentProcessor --> UserRepository
    PublisherFacade --> CatalogRepository
    
    UserRepository --> PostgreSQL
    OrderRepository --> PostgreSQL
    CatalogRepository --> PostgreSQL
    
    NotificationEngine -.-> Redis
```

### Layer Mapping Details:
1. **Presentation Layer:** Contains UI views for Customers. Maps to the **Actors** in the Use Case Diagram.
2. **Business Logic Layer:** Where the core algorithms and Design Patterns live. Maps directly to `PaymentProcessor`, `PublisherFacade`, `OrderFactory`, `OrderState`, and `NotificationEngine` from the Class Diagram.
3. **Data Access Layer:** Utilizes the Repository pattern to decouple SQL queries from business logic. Translates business objects into database records.
4. **Database Layer:** The raw storage engines maintaining ACID compliance for Customer data and Order states.
