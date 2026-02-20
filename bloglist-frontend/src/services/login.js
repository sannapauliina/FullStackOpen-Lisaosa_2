import axios from 'axios'

console.log('LOGIN BACKEND URL:', import.meta.env.VITE_BACKEND_URL)

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/login`

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
