# UniPin Game-TopUp System SDD

**Members:** 
- Kuy Visal
- Rous Rendo
- Kuoch Bunpor
- Ny Sihac

## Table Of Contents

- Project Overview
- Project Scope
- Functional Requirements & Non-Functional Requirements
- UML Diagrams
  - Use-Case Diagram
  - Class Diagram
  - Sequence Diagram
  - Activity Diagram
  - State Diagram
- Design Patterns
  - Creational
  - Structural
  - Behavioral
- Layered Architecture
- Document References

---

## Project Overview
This project goal is to analyse and study UniPin’s Game-TopUp system. In hopes of understanding the ins and outs of it.

## Project Scope
This project will be solely focusing on the TopUp system and won’t be touching their other features like their reselling program. 

**The scope will include the following (In-Scope):**
- User-beginner UI interface
- Mock Topup Demo with Mock Data
- Implementation With Design Pattern in mind
- Backend & Database integration

**This project won’t be including the following (Out-of-Scope):**
- A real MVP of the topup system
- Integration with real game-developers
- No B2B Business with resellers
- Authentication

---

## Functional Requirements & Non-Functional Requirements

### Functional Requirements
- **FR-01 In-game Account Link:** Users should be able to link with their in-game account just with their game id
- **FR-02 Payment method:** Users should be able to choose a payment method. (ABA, ACELEDA, and etc)
- **FR-03 Promo-codes:** Users should be able to use promo-codes alongside their purchases to get a discount.
- **FR-04 Currency denomination selector:** Users should be able to select the amount of currency that they want to pay for.
- **FR-05 Confirm popup before payment:** Users should confirm before payment if they’re making payment to the right account.

### Non-Functional Requirements
- **NFR-01 Responsiveness:** Users should only wait at a maximum of 10s for their payment to go through.
- **NFR-02 Scalability:** Should be able to handle 100 users making requests at the same time.
- **NFR-03 Reliability:** Database should have an uptime of 99.67% 
- **NFR-04 Reusability & Readability:** Code written should have design pattern in mind.

---

## UML Diagrams

### Use-Case Diagram

**Actors**
- **User:** The primary actor on the left who interacts with the system interface to browse and purchase game currency.
- **Game Publisher:** The secondary actor on the right who handles backend verification and fulfillment processes.

**Use Cases and Relationships**
- **User Interactions:**
  - The User initiates the process by interacting with the Browse Game use case.
  - Browse Game has an `<<extend>>` relationship to Select Game, showing the flow moves to game selection.
  - Select Game has an `<<extend>>` relationship to Buy currency, indicating the user can proceed to purchase.
  - The Buy currency use case has three mandatory `<<include>>` relationships that must be executed:
    - Enter PlayerID
    - Select Denomination (Package)
    - Process Payment
  - The Enter PlayerID use case further includes (`<<include>>`) Verify Player, meaning player verification is a required part of entering the ID.
  - The Process Payment use case includes (`<<include>>`) Generate Receipt, meaning a receipt is mandatorily created when payment is processed.
- **Game Publisher Interactions:** 
  - The Game Publisher is connected directly to three backend operations to complete the transaction lifecycle:
    - Verify Player: Connects to this use case (which was triggered by the user) to confirm the account is valid.
    - Verify Payment: Independently checks and confirms the payment status.
    - Deliver Goods: Executes the final step to send the purchased items or currency to the player.

```mermaid
flowchart LR
    %% Actors
    Customer(["User"])
    GameAPI(["Game Publisher"])
    
    %% System Boundary
    subgraph System ["UniPin TopUp System"]
        direction TB
        UC_Browse("Browse Game")
        UC_Select("Select Game")
        UC_Purchase("Buy currency")
        
        UC_EnterID("Enter PlayerID")
        UC_SelectDenom("Select Denomination")
        UC_Pay("Process Payment")
        
        UC_Validate("Verify Player")
        UC_VerifyPay("Verify Payment")
        UC_Deliver("Deliver Goods")
        UC_Receipt("Generate Receipt")
        
        %% Extends
        UC_Select -. "<<extend>>" .-> UC_Browse
        UC_Purchase -. "<<extend>>" .-> UC_Select
        
        %% Includes
        UC_Purchase -. "<<include>>" .-> UC_EnterID
        UC_Purchase -. "<<include>>" .-> UC_SelectDenom
        UC_Purchase -. "<<include>>" .-> UC_Pay
        
        UC_EnterID -. "<<include>>" .-> UC_Validate
        UC_Pay -. "<<include>>" .-> UC_Receipt
    end
    
    %% Associations
    Customer --> UC_Browse
    
    UC_Validate --> GameAPI
    UC_VerifyPay --> GameAPI
    UC_Deliver --> GameAPI
```

### Class Diagram

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

    %% ── GAME CATALOG — Singleton Pattern ────────────
    class GameCatalog {
        -GameCatalog instance
        -List gameData
        -GameCatalog()
        +getInstance() GameCatalog
        +getAllGames() List
        +getGameById(id String) Game
    }

    class Package {
        +String packageId
        +number amount
        +number originalPrice
        +number price
    }

    GameCatalog "1" *-- "0..*" Package : manages
    GuestUser "0..*" --> "1" GameCatalog : Browse

    %% ── ORDER — Builder Pattern ──────────
    class OrderBuilder {
        -TopUpOrder order
        +OrderBuilder()
        +setGameCode(gameCode String) OrderBuilder
        +setPlayer(playerId String, zoneId String) OrderBuilder
        +setPackage(packageId String, amount number, price number) OrderBuilder
        +build() TopUpOrder
    }

    class TopUpOrder {
        +String orderId
        +String playerId
        +String zoneId
        +String packageId
        +String gameCode
        +double amount
        +double finalPrice
        +OrderStatus status
        +setState(newState OrderState) void
        +pay() void
        +deliver(success bool) void
        +getFinalPrice() double
    }

    OrderBuilder ..> TopUpOrder : constructs

    %% ── STATE PATTERN ───────────────────────────────
    class OrderState {
        <<interface>>
        +getStatusString() String
        +pay(order TopUpOrder) void
        +deliver(order TopUpOrder, success bool) void
    }

    class PendingState {
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

    OrderState <|.. PendingState
    OrderState <|.. CompletedState
    OrderState <|.. FailedState
    TopUpOrder "1" --> "1" OrderState

    %% ── PAYMENT — Strategy Pattern ──────────────────
    class PaymentProcessor {
        -strategy PaymentStrategy
        +setStrategy(strategy PaymentStrategy) void
        +processPayment(amount double) void
    }

    class PaymentStrategy {
        <<interface>>
        +pay(amount double) void
        +refund(amount double) void
    }

    class CreditCardStrategy {
        +pay(amount double) void
        +refund(amount double) void
    }

    class EWalletStrategy {
        +pay(amount double) void
        +refund(amount double) void
    }

    class BankTransferStrategy {
        +pay(amount double) void
        +refund(amount double) void
    }

    PaymentStrategy <|.. CreditCardStrategy
    PaymentStrategy <|.. EWalletStrategy
    PaymentStrategy <|.. BankTransferStrategy
    PaymentProcessor "1" --> "1" PaymentStrategy : choose
    TopUpOrder "1" --> "1" PaymentProcessor : has

    %% ── DELIVERY — Adapter & Facade Pattern ─────────
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

    class MoontonAdapter {
        -moontonSDK MoontonLegacySystem
        +getServerList(gameCode) void
        +verify(playerId, zoneID) void
        +checkout(orderId, amount) void
        +deliver(orderId, amount) void
    }

    class TencentAdapter {
        -tencentSDK TencentRestAPI
        +getServerList(gameCode) void
        +verify(playerId, zoneID) void
        +checkout(orderId, amount) void
        +deliver(orderId, amount) void
    }

    class MoontonLegacySystem {
        <<Third-Party>>
        +checkAccountValid(accId, serverId)
        +addDiamonds(txId, accId, serverId, count)
    }

    class TencentRestAPI {
        <<Third-Party>>
        +validateSession(openId)
        +grantGameCurrency(orderId, openId, amount)
    }

    GamePublisherAPI <|.. MoontonAdapter
    GamePublisherAPI <|.. TencentAdapter
    MoontonAdapter --> MoontonLegacySystem : adapts
    TencentAdapter --> TencentRestAPI : adapts

    TopUpOrder ..> PublisherFacade : validate/deliver
    PublisherFacade ..> GamePublisherAPI : routes to specific adapter
```

### Sequence Diagram

**Flow:**
1. **Game Selection Phase**
   - The User initiates the process by sending a Select Game action to UniPin.
   - UniPin requests server information from the Game Publisher using GetServerList().
   - The Game Publisher replies to UniPin with a SeverListResponse, providing the server_id and server_name.
   - UniPin processes this and uses it to Show game page to the User.
2. **User Verification Phase**
   - The User proceeds to Input user details and Select payment method on the UniPin interface.
   - UniPin sends a Verify() request to the Game Publisher to validate the provided user details against the game's database.
   - The Game Publisher sends back a UserVerificationResponse (which, according to the diagram, returns server_id, server_name).
   - UniPin successfully validates the account and triggers Load game username/nickname to display the confirmed player name back to the User.
3. **Checkout Phase**
   - The User initiates the final purchase by sending a Confirm checkout command to UniPin.
   - UniPin forwards a Checkout() request to the Game Publisher to prepare the transaction on their end.
   - The Game Publisher acknowledges this by returning a CheckoutResponse, which includes a providerTxn_id (transaction ID) to track the purchase.
   - UniPin then transitions the User to the next step via Show payment page.
4. **Payment & Delivery Phase**
   - The User executes the Complete Payment action with UniPin.
   - Upon successful payment, UniPin sends a Delivery() command to the Game Publisher to fulfill the order.
   - The Game Publisher executes DeliverGoods() directly to the User (representing the in-game delivery of the purchased currency or items to the player's account).
   - Simultaneously, the Game Publisher sends a DeliveryResponse(status) back to UniPin to confirm whether the delivery was successful.
   - Finally, UniPin communicates this final result to the User via Show delivery status.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UniPin as UniPin Portal
    participant GameAPI as Game Publisher

    %% 1. Game Selection Phase
    User->>UniPin: Select Game
    UniPin->>GameAPI: GetServerList()
    GameAPI-->>UniPin: SeverListResponse(server_id, server_name)
    UniPin-->>User: Show game page

    %% 2. User Verification Phase
    User->>UniPin: Input user details & Select payment method
    UniPin->>GameAPI: Verify(playerId, serverId)
    GameAPI-->>UniPin: UserVerificationResponse(server_id, server_name)
    UniPin-->>UniPin: Load game username/nickname
    UniPin-->>User: Display confirmed player name

    %% 3. Checkout Phase
    User->>UniPin: Confirm checkout
    UniPin->>GameAPI: Checkout(orderId, amount)
    GameAPI-->>UniPin: CheckoutResponse(providerTxn_id)
    UniPin-->>User: Show payment page

    %% 4. Payment & Delivery Phase
    User->>UniPin: Complete Payment
    UniPin->>GameAPI: Delivery(providerTxn_id)
    GameAPI->>User: DeliverGoods()
    GameAPI-->>UniPin: DeliveryResponse(status)
    UniPin-->>User: Show delivery status
```

### Activity Diagram

**Flow:**
- **Start:** The process is initiated.
- **Browse Game:** The user browses for a game.
  - **Condition - Does the game exist in the database?**
    - **If no:** The state moves to "Game not found" and loops the user back to the "Browse Game" step.
    - **If yes:** The process continues.
- **Select Game:** The user selects the confirmed game.
- **Input playerID:** The user inputs their specific player ID for that game.
  - **Condition - Does the player exist in the game?**
    - **If no:** The state moves to "Player not found" and loops the user back to the "Input playerID" step.
    - **If yes:** The process continues.
- **Display username:** The system successfully retrieves and displays the username associated with the player ID.
- **Select Denomination:** The user chooses the amount or specific item they wish to purchase.
- **Select payment method:** user will be prompted to pick between credit card, debit card, and E-wallet.
- **Make payment:** The user initiates the payment process.
  - **Condition - Sufficient funds?**
    - **If no:** The state moves to "Insufficient Funds" and loops the user back to the "Make payment" step to try again or use a different method.
    - **If yes:** The payment succeeds, and the process continues.
- **Show delivery status:** The system displays the status of the item or currency being delivered to the player's account.
- **Generate receipt:** The system generates a final receipt for the completed transaction.
- **End:** The activity flow terminates.

```mermaid
flowchart TD
    Start([Start]) --> BrowseGame[Browse Game]
    
    BrowseGame --> GameExist{Does the game exist in the database?}
    GameExist -->|No| GameNotFound([Game not found])
    GameNotFound --> BrowseGame
    GameExist -->|Yes| SelectGame[Select Game]
    
    SelectGame --> InputID[Input playerID]
    
    InputID --> PlayerExist{Does the player exist in the game?}
    PlayerExist -->|No| PlayerNotFound([Player not found])
    PlayerNotFound --> InputID
    PlayerExist -->|Yes| ShowUsername[Display username]
    
    ShowUsername --> SelectDenom[Select Denomination]
    SelectDenom --> SelectPay[Select payment method]
    SelectPay --> MakePay[Make payment]
    
    MakePay --> Funds{Sufficient funds?}
    Funds -->|No| InsufficientFunds([Insufficient Funds])
    InsufficientFunds --> MakePay
    Funds -->|Yes| ShowDelivery[Show delivery status]
    
    ShowDelivery --> GenReceipt[Generate receipt]
    GenReceipt --> End([End])
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> PendingState : Order initiated
    
    PendingState --> CompletedState : Payment & Delivery Success
    PendingState --> FailedState : Payment Rejected / Delivery Timeout
    
    CompletedState --> [*]
    FailedState --> [*]
```

---

## Design Patterns

We have applied 6 design patterns to solve specific architectural problems in the UniPin System.

### Creational
| Pattern | Problem Solved | Location in Class Diagram |
| :--- | :--- | :--- |
| **Singleton Pattern** | Centralized management of games and packages (the source of truth where Admin applies package discounts) so only a single instance of the catalog is loaded globally. | `GameCatalog` class with `getInstance()`. |
| **Builder Pattern** | A `TopUpOrder` requires setting multiple complex fields (playerId, zoneId, package details). Builder helps construct the order step-by-step cleanly. | `OrderBuilder` class with methods like `setPlayer()`, `setPackage()`, and `build()`. |

### Structural
| Pattern | Problem Solved | Location in Class Diagram |
| :--- | :--- | :--- |
| **Facade Pattern** | UniPin connects to dozens of different Game Publishers (Moonton, Tencent), all with entirely different APIs. The core system shouldn't know these details. | `PublisherFacade` class. It shields the `TopUpOrder` from the complexity of external APIs. |
| **Adapter Pattern** | Third-party game publishers have incompatible, proprietary APIs. We need a unified way to communicate with them. | `MoontonAdapter`, `TencentAdapter` implementing `GamePublisherAPI`. |

### Behavioral
| Pattern | Problem Solved | Location in Class Diagram |
| :--- | :--- | :--- |
| **Strategy Pattern** | Top-ups can be paid for via Credit Cards, E-Wallets, or Bank Transfers. Writing `if/else` for every payment method makes checkout rigid. | `PaymentProcessor` uses the `PaymentStrategy` interface. |
| **State Pattern** | Orders have a strict lifecycle. State transitions require complex validation. | `OrderState` interface and concrete state classes (`PendingState`, `CompletedState`, `FailedState`). |

---

## Layered Architecture

```mermaid
flowchart TD
    subgraph Presentation Layer
        WebPortal[UniPin Web Portal React App]
    end

    subgraph Business Logic Layer
        OrderSvc[Order Processing Service]
        PromoSvc[Promotion Engine]
        PaySvc[Payment Strategy Processor]
    end

    subgraph Integration Layer
        Facade[Publisher Facade]
        Adapters[Moonton/Tencent Adapters]
    end

    subgraph Data Access Layer
        DB[(PostgreSQL Database)]
        Redis[(Redis Cache)]
    end

    WebPortal --> OrderSvc
    OrderSvc --> PromoSvc
    OrderSvc --> PaySvc
    OrderSvc --> Facade
    Facade --> Adapters
    
    OrderSvc --> DB
    PromoSvc --> DB
    Facade --> Redis
```

## Document References
- UniPin developer documents (Game-Top Up v1) https://developer-docs.unipin.com/#top-up
