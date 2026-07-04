import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
})

export const validateUser = (payload) => client.post('/in-game-topup/user/validate', payload)
export const createOrder = (payload) => client.post('/in-game-topup/order/create', payload)
export const inquiryOrder = (payload) => client.post('/in-game-topup/order/inquiry', payload)
export const fetchList = (payload) => client.post('/in-game-topup/list', payload)
export const fetchDetail = (payload) => client.post('/in-game-topup/detail', payload)

export default client
