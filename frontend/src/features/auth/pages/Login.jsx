import React, {useState} from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import {useAuth} from "../Hooks/useAuth"
// import { useState } from 'react'

const Login = () => {
const {loading, handlerlogin} = useAuth()
const Navigate = useNavigate();

const [email, setemail] = useState("")
const [password, setpassword] = useState("")
  

  const handleSubmit = async (e)=>{
    e.preventDefault()
    await handlerlogin({email, password})
    Navigate('/')
  }

  if (loading) {
  return (
    <main className="loading-container">
      <div className="loader"></div>
      <h2>Please wait...</h2>
      <p>We're processing your request.</p>
    </main>
  );
}
  return (

    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
         <div className="input-group">
          <label htmlFor="email">email</label>
          <input onChange={(e)=>setemail(e.target.value)}
          type = "email" id="email" name="email" placeholder='Enter email address' />
         </div>

         <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
          onChange={(e)=>setpassword(e.target.value)}
           type="password" id="password" name="password" placeholder='Enter password'/>
         </div>


         <button type="submit" className="button primary-button">Login</button>

               <p>Don't have an account? <Link to={"/register"}>register</Link></p>
        </form>

        
      </div>
      </main>
  )
}

export default Login