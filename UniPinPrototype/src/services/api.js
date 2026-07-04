import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dummy-api.example.com',
  timeout: 2000,
})

export const validatePlayer = async (game, userId) => {
  await new Promise((resolve) => setTimeout(resolve, 900))

  if (!userId.trim()) {
    throw new Error('Please enter a valid user ID')
  }

  return {
    game,
    userId,
    profileName: 'NovaGamer',
  }
}

export const createPayment = async ({ game, packageAmount, paymentMethod }) => {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  if (!paymentMethod) {
    throw new Error('Select a payment method to continue')
  }

  return {
    success: true,
    orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
    receipt: `Top-up ${packageAmount} diamonds for ${game}`,
  }
}

export default api
