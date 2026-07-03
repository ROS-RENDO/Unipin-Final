// 4. OBSERVER PATTERN
// Problem: Decoupling the transactional order process from side effects like Emails and Webhooks.
// Solution: Notification engine pushes updates to registered observers.

export interface OrderObserver {
    update(orderId: string, status: string): void;
}

export class EmailReceiptNotifier implements OrderObserver {
    update(orderId: string, status: string): void {
        console.log(`[Observer - Email] Sending Email Receipt for Order ${orderId}: Status is now ${status}`);
        // In a real app, this sends an email via SMTP/SendGrid
    }
}

export class WebhookNotifier implements OrderObserver {
    update(orderId: string, status: string): void {
        console.log(`[Observer - Webhook] Firing HTTP POST to Reseller Endpoint for Order ${orderId}: Status = ${status}`);
        // In a real app, this sends an HTTP POST request to a partner URL
    }
}

export class NotificationEngine {
    private observers: OrderObserver[] = [];

    attach(observer: OrderObserver) {
        this.observers.push(observer);
    }

    notify(orderId: string, status: string) {
        console.log(`[Notification Engine] Notifying ${this.observers.length} observers...`);
        for (const observer of this.observers) {
            observer.update(orderId, status);
        }
    }
}
