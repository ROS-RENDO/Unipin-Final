// 3. STATE PATTERN
// Problem: Strict top-up order lifecycles where invalid transitions cause bugs (e.g., refunding a non-paid order).
// Solution: State objects handle their own behavior and valid transitions.

import { TopUpOrder } from "./OrderFactory";

export interface OrderState {
    getStatusString(): string;
    pay(_order: TopUpOrder): void;
    deliver(_order: TopUpOrder, _success: boolean): void;
}

export class PendingState implements OrderState {
    getStatusString() { return "Pending"; }
    
    pay(_order: TopUpOrder) {
        // Handled directly by processPayment logic
    }
    
    deliver(order: TopUpOrder, success: boolean) {
        if (success) {
            console.log("[State] Delivery successful. Transitioning to 'Completed'.");
            order.setState(new CompletedState());
        } else {
            console.log("[State] Delivery failed. Transitioning to 'Failed'.");
            order.setState(new FailedState());
        }
    }
}

export class CompletedState implements OrderState {
    getStatusString() { return "Completed"; }
    pay(_order: TopUpOrder) { console.error("[State] ERROR: Order already completed."); }
    deliver(_order: TopUpOrder, _success: boolean) { console.error("[State] ERROR: Order already completed."); }
}

export class FailedState implements OrderState {
    getStatusString() { return "Failed"; }
    pay(_order: TopUpOrder) { console.error("[State] ERROR: Order failed."); }
    deliver(_order: TopUpOrder, _success: boolean) { console.error("[State] ERROR: Order failed."); }
}
