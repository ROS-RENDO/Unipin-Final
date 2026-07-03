// 3. STATE PATTERN
// Problem: Strict top-up order lifecycles where invalid transitions cause bugs (e.g., refunding a non-paid order).
// Solution: State objects handle their own behavior and valid transitions.

import { TopUpOrder } from "./OrderFactory";

export interface OrderState {
    getStatusString(): string;
    pay(_order: TopUpOrder): void;
    deliver(_order: TopUpOrder, _success: boolean): void;
}

export class CreatedState implements OrderState {
    getStatusString() { return "Created"; }
    
    pay(order: TopUpOrder) {
        console.log("[State] Payment received. Transitioning to 'Processing Delivery'.");
        order.setState(new ProcessingDeliveryState());
    }
    
    deliver(_order: TopUpOrder, _success: boolean) {
        console.error("[State] ERROR: Cannot deliver an order that is not paid.");
    }
}

export class ProcessingDeliveryState implements OrderState {
    getStatusString() { return "Processing Delivery"; }
    
    pay(_order: TopUpOrder) {
        console.error("[State] ERROR: Order is already paid.");
    }
    
    deliver(order: TopUpOrder, success: boolean) {
        if (success) {
            console.log("[State] Delivery successful. Transitioning to 'Completed'.");
            order.setState(new CompletedState());
        } else {
            console.log("[State] Delivery failed. Transitioning to 'Failed (Refunded)'.");
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
    getStatusString() { return "Failed (Refunded)"; }
    pay(_order: TopUpOrder) { console.error("[State] ERROR: Order failed."); }
    deliver(_order: TopUpOrder, _success: boolean) { console.error("[State] ERROR: Order failed."); }
}
