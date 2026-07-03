# FESE306 – Software Modeling & Design
## Final Project: Software Design Document (SDD)
**Project Name:** WOWNOW Gaming System (Top-up & Gaming Buddy)
**Team Members:** Kuy Visal, Kouch Bunpor, Ny Sihac, Rous Rendo
**Instructor:** Pen Voneat

---

## 1. Project Scenario & Overview

The **WOWNOW Gaming System** is an integrated feature within the WOWNOW super-app ecosystem. It serves a dual purpose:
1. **Digital Top-Up (via Unipin):** WOWNOW acts as a Reseller / Game Center, allowing gamers to purchase in-game currency. WOWNOW integrates with Unipin's API to retrieve game lists, validate user game IDs, create orders, and deliver digital goods directly to the user's game account.
2. **Gaming Buddy Marketplace:** A peer-to-peer service functioning similarly to ride-sharing. 
   - **Gamers (Buyers/Riders)** request companion sessions.
   - **Gaming Buddies (Sellers/Drivers)** accept requests and play with the gamers.
   - Orders follow a lifecycle: Requested → Accepted → In-Progress → Completed / Cancelled.
   - Real-time notifications and an admin module for dispute management are included.

---

## 2. UML Diagrams — Full Suite

### 2.1 Use Case Diagram
**Actors:** Gamer (Buyer), Gaming Buddy (Seller), Admin, Unipin API.
**Use Cases (min. 5):** Top Up Game Currency, Hire Gaming Buddy, Accept Booking, Resolve Dispute, Manage Game Catalog.

```mermaid
flowchart LR
    %% Actors
    Gamer["Gamer (Buyer)"]
    Buddy["Gaming Buddy (Seller)"]
    Admin["Platform Admin"]
    UnipinAPI["Unipin API (External)"]

    %% System Boundary
    subgraph WOWNOW_Gaming_System ["WOWNOW Gaming System"]
        UC_TopUp(["Top Up Game Currency"])
        UC_HireBuddy(["Hire Gaming Buddy"])
        UC_AcceptBooking(["Accept Booking Request"])
        UC_CancelBooking(["Cancel Booking Request"])
        UC_ResolveDispute(["Resolve Disputes"])
        UC_ManageCatalog(["Manage Game Catalog"])
    end

    %% Associations
    Gamer --> UC_TopUp
    Gamer --> UC_HireBuddy
    Gamer --> UC_CancelBooking
    
    Buddy --> UC_AcceptBooking
    
    Admin --> UC_ResolveDispute
    Admin --> UC_ManageCatalog
    
    UC_TopUp --> UnipinAPI
```

### 2.2 Class Diagram
This class diagram illustrates the full system model, incorporating the design patterns used for payment strategies, Unipin API facades, state management, and notifications.

```mermaid
classDiagram
    %% Core Entities
    class User {
        +int userId
        +string name
        +string email
        +login()
    }
    class Gamer {
        +int pointsBalance
        +linkGameAccount()
    }
    class Buddy {
        +double hourlyRate
        +string status
        +acceptBooking()
    }
    class Admin {
        +resolveDispute()
    }
    User <|-- Gamer
    User <|-- Buddy
    User <|-- Admin

    %% Factory Method Pattern
    class OrderFactory {
        +createOrder(type, details): Order
    }

    %% State Pattern
    class Order {
        <<abstract>>
        +int orderId
        +double amount
        +OrderState state
        +setState(OrderState)
        +process()
        +cancel()
    }
    class OrderState {
        <<interface>>
        +handle(Order)
    }
    class RequestedState { +handle(Order) }
    class AcceptedState { +handle(Order) }
    class InProgressState { +handle(Order) }
    class CompletedState { +handle(Order) }
    class CancelledState { +handle(Order) }
    
    OrderState <|.. RequestedState
    OrderState <|.. AcceptedState
    OrderState <|.. InProgressState
    OrderState <|.. CompletedState
    OrderState <|.. CancelledState
    Order *-- OrderState : manages state

    class TopUpOrder {
        +string gameId
        +string serverId
    }
    class HiringOrder {
        +int buddyId
        +int duration
    }
    Order <|-- TopUpOrder
    Order <|-- HiringOrder
    OrderFactory --> Order : creates

    %% Strategy Pattern
    class PaymentProcessor {
        -PaymentStrategy strategy
        +setStrategy(PaymentStrategy)
        +pay(amount)
    }
    class PaymentStrategy {
        <<interface>>
        +pay(amount)
    }
    class ABAPayStrategy { +pay(amount) }
    class WingPayStrategy { +pay(amount) }
    class PointsDiscountStrategy { +pay(amount) }
    
    PaymentStrategy <|.. ABAPayStrategy
    PaymentStrategy <|.. WingPayStrategy
    PaymentStrategy <|.. PointsDiscountStrategy
    Order "1" -- "1" PaymentProcessor : paid via

    %% Facade Pattern
    class UnipinFacade {
        +getGameList()
        +validateUser(gameId, userId)
        +createOrder(paymentRef)
        +verifyDelivery()
    }
    TopUpOrder --> UnipinFacade : uses

    %% Observer Pattern
    class NotificationEngine {
        -List observers
        +attach(Observer)
        +notify(event)
    }
    class Observer {
        <<interface>>
        +update(event)
    }
    class PushNotifier { +update(event) }
    class EmailNotifier { +update(event) }
    
    Observer <|.. PushNotifier
    Observer <|.. EmailNotifier
    Order --> NotificationEngine : triggers events
```

### 2.3 Sequence Diagrams (3 Flows)

#### Sequence 1: Digital Top-Up via Unipin (Reseller Flow)
*This flow demonstrates WOWNOW acting as a Reseller integrating with Unipin to deliver digital game currency.*

```mermaid
sequenceDiagram
    autonumber
    actor Gamer
    participant App as WOWNOW App
    participant UnipinFacade as Unipin Facade
    participant UnipinAPI as Unipin.com API
    participant GameAPI as Game Publisher

    Gamer->>App: Retrieve Game List
    App->>UnipinFacade: getGameList()
    UnipinFacade->>UnipinAPI: API: Get Game List
    UnipinAPI-->>UnipinFacade: Return Games
    UnipinFacade-->>App: Display Game Catalog

    Gamer->>App: Select Game & Enter Game ID
    App->>UnipinFacade: validateUser(gameID)
    UnipinFacade->>UnipinAPI: API: Validate User
    UnipinAPI->>GameAPI: Request Validation
    GameAPI-->>UnipinAPI: Status OK
    UnipinAPI-->>UnipinFacade: Validated Nickname
    UnipinFacade-->>App: Show Nickname

    Gamer->>App: Checkout & Pay
    App->>UnipinFacade: createOrder()
    UnipinFacade->>UnipinAPI: API: Create Order
    UnipinAPI->>GameAPI: Process Top Up (Delivery)
    GameAPI-->>UnipinAPI: Delivery Status
    UnipinAPI-->>UnipinFacade: Order Success
    UnipinFacade-->>App: Generate Delivery Receipt
    App-->>Gamer: Display "Top-Up Successful"
```

#### Sequence 2: Hiring a Gaming Buddy
*This flow demonstrates requesting a buddy, dynamic pricing, and escrow payment.*

```mermaid
sequenceDiagram
    autonumber
    actor Gamer
    participant App
    participant OrderFactory as Order Factory
    participant BuddyService as Buddy Service
    participant PayProcessor as Payment Processor
    actor Buddy

    Gamer->>App: Request Buddy (Duration, Rank)
    App->>OrderFactory: createOrder("Hiring", details)
    OrderFactory-->>App: Return HiringOrder (State: Requested)
    
    App->>BuddyService: Calculate dynamic price & Route to Buddy
    BuddyService->>Buddy: Push Notification (New Request)
    
    Buddy->>App: Accept Request
    App->>BuddyService: Update Order (State: Accepted)
    
    App->>PayProcessor: Execute Escrow Payment (Strategy: ABAPay)
    PayProcessor-->>App: Payment Success
    App->>BuddyService: Update Order (State: In-Progress)
    BuddyService->>Gamer: Notify "Session Started"
```

#### Sequence 3: Cancellation with Notification
*This flow demonstrates the Observer pattern in action when a Gamer cancels an order.*

```mermaid
sequenceDiagram
    autonumber
    actor Gamer
    participant App
    participant Order as Hiring Order
    participant State as OrderState (Cancelled)
    participant Notifier as Notification Engine
    actor Buddy

    Gamer->>App: Cancel Session
    App->>Order: cancel()
    Order->>State: handle(Order)
    State-->>Order: Update State to 'Cancelled'
    
    Order->>Notifier: notify("Order_Cancelled")
    Notifier->>Buddy: Push Notification: "Gamer cancelled the session"
    Notifier->>Gamer: Push Notification: "Refund processing initiated"
```

### 2.4 Activity Diagram
*Workflow for the Reseller (WOWNOW) Purchase Flow via Unipin from start to finish.*

```mermaid
flowchart TD
    Start([Start]) --> Retrieve[Retrieve Game List]
    Retrieve --> SelectGame[Select Game Server & Denomination]
    SelectGame --> EnterID[Enter User Game ID]
    
    EnterID --> Validate{Is User Game ID Valid?}
    Validate -->|No| EnterID
    Validate -->|Yes| Checkout[Proceed to Checkout]
    
    Checkout --> Pay{Payment Successful?}
    Pay -->|No| Cancel([Order Failed / Cancelled])
    Pay -->|Yes| CreateOrder[Create Order via Unipin API]
    
    CreateOrder --> VerifyDelivery{Delivery Success from Game Pub?}
    VerifyDelivery -->|No| PerformInquiry[Perform API Inquiry / Retry]
    PerformInquiry --> VerifyDelivery
    VerifyDelivery -->|Yes| Receipt[Generate Delivery Receipt]
    
    Receipt --> End([End Workflow])
```

### 2.5 State Diagram
*State machine for the trip/order lifecycle (Requested → Accepted → In-Progress → Completed / Cancelled).*

```mermaid
stateDiagram-v2
    [*] --> Requested : Gamer creates order
    
    Requested --> Accepted : Buddy accepts request
    Requested --> Cancelled : Gamer cancels or timeout
    
    Accepted --> In_Progress : Payment confirmed, session starts
    Accepted --> Cancelled : Gamer cancels
    
    In_Progress --> Completed : Session duration ends & confirmed
    In_Progress --> Cancelled : Disputed & Admin cancelled
    
    Completed --> [*] : Escrow released
    Cancelled --> [*] : Refund issued
```

---

## 3. Design Pattern Application

We have applied 5 design patterns to solve specific architectural problems in the WOWNOW Gaming System.

| Pattern | Category | Problem Solved | Location in Class Diagram | Why Chosen |
| :--- | :--- | :--- | :--- | :--- |
| **1. Facade Pattern** | Structural | WOWNOW's core system shouldn't deal with the complex low-level HTTP calls, headers, and multiple endpoints required to talk to Unipin (Game lists, validations, ordering). | `UnipinFacade` class. It shields `TopUpOrder` from the complexity of `UnipinAPI`. | Chosen over making direct REST calls from the Order class to ensure loose coupling. If we switch from Unipin to another aggregator, we only change the Facade, not the Order logic. |
| **2. Strategy Pattern** | Behavioral | Gamers need to pay using ABA Pay, Wing, or WOWNOW points. Writing `if/else` for every payment method makes the checkout code rigid. | `PaymentProcessor` uses the `PaymentStrategy` interface, implemented by `ABAPayStrategy`, `WingPayStrategy`, etc. | Chosen over inheritance because payment methods are interchangeable behaviors at runtime. It perfectly adheres to the Open/Closed Principle. |
| **3. State Pattern** | Behavioral | Orders have a strict lifecycle (Requested → Accepted → In-Progress → Completed). State transitions require complex validation (e.g., you can't cancel a Completed order). | `OrderState` interface and concrete classes (`RequestedState`, `AcceptedState`, etc.) managing the `Order`. | Chosen over massive switch statements inside the `Order` class. Each state handles its own rules and transitions cleanly. |
| **4. Observer Pattern** | Behavioral | When an order changes state or is cancelled, multiple unrelated subsystems (Email service, Push notification service, UI) need to react instantly. | `NotificationEngine` (Subject) and `Observer` interface implemented by `PushNotifier` and `EmailNotifier`. | Chosen because it allows us to add new notification methods (like SMS) without modifying the core `Order` logic. |
| **5. Factory Method** | Creational | We have two distinct types of transactions: Buying Game Currency (`TopUpOrder`) and booking a human (`HiringOrder`). Their initialization logic is entirely different. | `OrderFactory` class with `createOrder()` which produces an `Order`. | Chosen over direct instantiation (`new TopUpOrder()`) in the UI controllers, centralizing the complex creation logic and ensuring dependency inversion. |

---

## 4. Layered Architecture Diagram

The system employs a strict 4-Tier Layered Architecture separating concerns from user interaction down to data storage.

```mermaid
flowchart TD
    subgraph Presentation Layer [1. Presentation Layer / UI]
        MobileApp[WOWNOW Mobile App iOS/Android]
        WebPortal[Admin Web Portal]
    end

    subgraph Business Logic Layer [2. Business Logic Layer]
        OrderController[Order Controller]
        PaymentProcessor[Payment Processor / Strategies]
        UnipinFacade[Unipin Integration Facade]
        NotificationEngine[Notification Engine / Observers]
        OrderStateMgr[State Management]
    end

    subgraph Data Access Layer [3. Data Access Layer]
        UserRepository[User Repository]
        OrderRepository[Order Repository]
        CatalogRepository[Game Catalog Repository]
    end

    subgraph Database Layer [4. Database Layer]
        PostgreSQL[(PostgreSQL Relational DB)]
        Redis[(Redis Cache for live chat/status)]
    end

    %% Mapping connections
    MobileApp --> OrderController
    WebPortal --> OrderController
    
    OrderController --> OrderStateMgr
    OrderController --> UnipinFacade
    OrderController --> PaymentProcessor
    
    OrderStateMgr --> NotificationEngine
    
    OrderStateMgr --> OrderRepository
    PaymentProcessor --> UserRepository
    UnipinFacade --> CatalogRepository
    
    UserRepository --> PostgreSQL
    OrderRepository --> PostgreSQL
    CatalogRepository --> PostgreSQL
    
    NotificationEngine -.-> Redis
```

### Layer Mapping details:
1. **Presentation Layer:** Contains UI views for Gamers and Buddies. Maps to the **Actors** in the Use Case Diagram.
2. **Business Logic Layer:** Where the core algorithms and Design Patterns live. Maps directly to `PaymentProcessor`, `UnipinFacade`, `OrderFactory`, `OrderState`, and `NotificationEngine` from the Class Diagram.
3. **Data Access Layer:** Utilizes the Repository pattern to decouple SQL queries from business logic. Translates Java/C# objects into database records.
4. **Database Layer:** The raw storage engines maintaining ACID compliance for escrows and transactions.
