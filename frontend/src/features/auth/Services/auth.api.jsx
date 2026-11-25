
import axios from 'axios'

const API = '/api/auth'

export async function register({ username, email, password }) {
  try {
    const response = await axios.post(`${API}/register`, {
      username, email, password
    }, { withCredentials: true })
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function login({ email, password }) {
  try {
    const response = await axios.post(`${API}/login`, {
      email, password
    }, { withCredentials: true })
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function logout() {
  try {
    const response = await axios.get(`${API}/logout`, {
      withCredentials: true
    })
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getme() {
  try {
    const response = await axios.get(`${API}/get-me`, {
      withCredentials: true
    })
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
