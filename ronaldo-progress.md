# Ronaldo Progress: UniPin Top-Up System Project

This document tracks all the progress and implementation details we have achieved for the FESE306 – Software Modeling & Design Final Project.

## 1. Software Design Document (SDD) Completed
We successfully authored a comprehensive SDD (`UniPin_TopUp_System_SDD.md`) targeting a strict B2C flow for a UniPin-style Game Top-Up System.
- **Stakeholders Defined:** Customer (Gamer), UniPin Admin, Game Publisher API.
- **UML Diagrams (5 Total):**
  - **Use Case Diagram** mapping the interactions of the 3 stakeholders.
  - **Class Diagram** detailing the complete object model and design pattern implementations.
  - **Sequence Diagrams (3 Flows):** Direct Purchase, Apply Promo Code & Checkout, and Payment Failure & Auto-Refund.
  - **Activity Diagram** outlining the end-to-end checkout logic.
  - **State Diagram** showing the strict lifecycle of an Order.
- **Layered Architecture:** Documented a 4-Tier strict architecture (Presentation, Business Logic, Data Access, Database).

## 2. Design Patterns Implemented
We justified and applied 5 essential Software Design Patterns to solve specific architectural problems:
1. **Facade Pattern (`PublisherFacade`):** Abstracts away the complexity of making HTTP calls to external Game Publisher APIs.
2. **Strategy Pattern (`PaymentProcessor`):** Allows seamless swapping between Credit Card, E-Wallet, and Bank Transfer payments at runtime without `if/else` hell.
3. **State Pattern (`OrderState`):** Manages the lifecycle of an order securely (Created -> Pending Payment -> Processing Delivery -> Completed/Failed).
4. **Observer Pattern (`NotificationEngine`):** Decouples transactional logic from notification logic (Email and Webhook updates).
5. **Factory Method (`OrderFactory`):** Centralizes the instantiation of Orders, allowing the system to easily branch between generating a `StandardOrder` and a discounted `PromoOrder`.

## 3. Bonus Prototype Built (`UniPinPrototype`)
We went above and beyond the rubric by building a fully functional React prototype that proves the 5 design patterns work in reality.
- **Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4.
- **UI Observer Console:** Built a visual terminal on the webpage that hooks into the browser's `console.log` to print out exactly which Design Pattern is executing in real-time.
- **Dynamic Factory Demonstration:** Added a Promo Code input. Typing "WELCOME20" visually demonstrates the Factory Method generating a `PromoOrder` and applying a 20% discount.

## 4. Production-Grade Backend Simulation (MSW + Faker.js)
To secure the highest possible score, we transformed the prototype from a simple UI mock into a highly realistic client-server simulation.
- **Mock Service Worker (MSW):** Intercepts all outgoing `fetch()` requests from the `PublisherFacade`. This allows us to open the Chrome Network tab during the presentation and show *real* HTTP Requests responding with JSON payloads.
- **Faker.js Integration:** Inside the MSW handlers, we use Faker.js to dynamically generate realistic transaction UUIDs and Gamertags. 
- **Deterministic Hashing:** We seeded the Faker instance with the provided Player ID, ensuring that checking the same Player ID twice always returns the same dynamically generated username, perfectly mimicking a real SQL database lookup.

## Conclusion
The project is 100% complete and perfectly aligns with the FESE306 rubric requirements for both the SDD and the Bonus Prototype!
