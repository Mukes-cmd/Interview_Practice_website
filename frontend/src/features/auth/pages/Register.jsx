import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../Hooks/useAuth'

const Register = () => {
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const { loading, handleregister } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await handleregister({ username, email, password })
    if (success) navigate("/")
    setusername("")  
    setemail("")  
    setpassword("")  
  }


  

  if (loading) {
    return (
      <main className="loading-container">
        <div className="loader"></div>
        <h2>Please wait...</h2>
        <p>We're processing your request.</p>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input value={username} onChange={(e) => setusername(e.target.value)}
              type="text" id="username" name="username" placeholder="Enter username" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setemail(e.target.value)}
              type="email" id="email" name="email" placeholder="Enter email address" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setpassword(e.target.value)}
              type="password" id="password" name="password" placeholder="Enter password" />
          </div>
          <button type="submit" className="button primary-button">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register