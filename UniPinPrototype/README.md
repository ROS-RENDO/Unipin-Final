# UniPin Top-Up System - Bonus Prototype (20 Pts)

This is the Bonus Prototype for the FESE306 Final Project.
The requirement is to show **observable behavior that proves the design patterns work**.

## How to Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173`

## Where to Find the 5 Design Patterns

The UI has a massive "Console Output" section on the right side. When you interact with the UI, you will see exactly which patterns are being triggered and what state they are in.

1. **Facade Pattern (`src/patterns/PublisherFacade.ts`)**
   - *In UI:* Click "Validate via Publisher Facade".
   - *Observable Behavior:* It mocks a complex API call to a Game Publisher and returns a success/fail, hiding the complexity from the UI.
2. **Strategy Pattern (`src/patterns/PaymentStrategy.ts`)**
   - *In UI:* Change the "Payment Strategy" dropdown and click "Pay & Deliver".
   - *Observable Behavior:* The console output explicitly shows whether the `CreditCardStrategy`, `EWalletStrategy`, or `ResellerBalanceStrategy` is processing the money.
3. **State Pattern (`src/patterns/OrderState.ts`)**
   - *In UI:* Look at the "Current State" tracker that appears when an order is created.
   - *Observable Behavior:* The order transitions `Created` -> `Processing Delivery` -> `Completed` (or `Failed (Refunded)`). The State classes strictly manage this.
4. **Observer Pattern (`src/patterns/NotificationObserver.ts`)**
   - *In UI:* Watch the console output when an order completes or fails.
   - *Observable Behavior:* The `NotificationEngine` automatically triggers the `EmailReceiptNotifier` and `WebhookNotifier` to push updates async.
5. **Factory Method Pattern (`src/patterns/OrderFactory.ts`)**
   - *In UI:* Switch between the "Direct Purchase (B2C)" and "Reseller API (B2B)" tabs before checking out.
   - *Observable Behavior:* The `OrderFactory` dynamically instantiates either a `DirectOrder` or an `APIOrder` depending on the tab, and the UI displays the Object type.
