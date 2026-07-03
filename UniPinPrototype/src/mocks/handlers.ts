import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';

export const handlers = [
  // 1. Mock the Player ID Validation endpoint
  http.get('/api/publisher/validate', async ({ request }) => {
    // Add artificial delay to simulate network latency
    await delay(800);
    
    const url = new URL(request.url);
    const playerId = url.searchParams.get('playerId');
    const gameCode = url.searchParams.get('gameCode');

    console.log(`[MSW Backend] Received validation request for game: ${gameCode}, player: ${playerId}`);

    if (!playerId || playerId.trim() === '') {
      return HttpResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Generate a realistic fake gamer tag based on the ID to simulate a live database lookup
    // Seeding Faker with the playerId ensures the same ID always returns the same username!
    faker.seed(parseInt(playerId, 10) || 123);
    const fakeUsername = faker.internet.username();

    return HttpResponse.json({
      success: true,
      data: {
        playerId,
        username: fakeUsername,
        gameCode,
      }
    });
  }),

  // 2. Mock the Currency Delivery endpoint
  http.post('/api/publisher/deliver', async ({ request }) => {
    // Add artificial delay for the transaction
    await delay(1200);

    const body = await request.json() as { playerId: string; gameCode: string; amount: number };
    
    console.log(`[MSW Backend] Received delivery request: ${body.amount} units to player: ${body.playerId}`);

    // Simulate a random failure (10% chance) to demonstrate the System's error handling
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return HttpResponse.json({
        success: true,
        transactionId: faker.string.uuid(),
        message: 'Currency delivered successfully.'
      });
    } else {
      return HttpResponse.json({
        success: false,
        error: 'Publisher API Timeout or Reject.'
      }, { status: 504 }); // Gateway Timeout
    }
  }),
];
