// 4. FACADE PATTERN
// Problem: The system needs to communicate with external Game Publishers. Each publisher might have wildly different APIs, auth headers, and XML/JSON responses.
// Solution: A PublisherFacade hides all this complexity and provides simple methods for the core system.

export class PublisherFacade {
    // In a real system, you might inject API keys here
    constructor() {}

    /**
     * Validates a player ID and returns their Nickname from the game server.
     */
    async validatePlayer(gameCode: string, playerId: string): Promise<string | null> {
        console.log(`[Facade] Calling external Publisher API to validate player ${playerId} for ${gameCode}...`);
        
        try {
            const response = await fetch(`/api/publisher/validate?gameCode=${gameCode}&playerId=${playerId}`);
            if (!response.ok) {
                console.error(`[Facade] ERROR: Publisher API returned ${response.status}`);
                return null;
            }
            const json = await response.json();
            if (json.success && json.data.username) {
                console.log(`[Facade] Publisher API confirmed player is: ${json.data.username}`);
                return json.data.username;
            }
            return null;
        } catch (error) {
            console.error(`[Facade] Network Error: Failed to validate player.`);
            return null;
        }
    }

    /**
     * Delivers the purchased currency to the player's account.
     */
    async deliverCurrency(gameCode: string, playerId: string, amount: number): Promise<boolean> {
        console.log(`[Facade] Calling external Publisher API to deliver ${amount} units to ${playerId}...`);
        
        try {
            const response = await fetch('/api/publisher/deliver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameCode, playerId, amount })
            });

            if (!response.ok) {
                console.error(`[Facade] ERROR: Publisher API failed to deliver! (Status: ${response.status})`);
                return false;
            }
            
            const json = await response.json();
            if (json.success) {
                console.log(`[Facade] Publisher API confirmed delivery. Transaction ID: ${json.transactionId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[Facade] Network Error: Failed to deliver currency.`);
            return false;
        }
    }
}
