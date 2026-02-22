import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/users`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
