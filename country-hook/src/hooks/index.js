import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        )
        setCountry({
          data: response.data,
          found: true
        })
      } catch (error) {
        setCountry({
          data: null,
          found: false
        })
      }
    }

    fetchCountry()
  }, [name])

  return country
}
