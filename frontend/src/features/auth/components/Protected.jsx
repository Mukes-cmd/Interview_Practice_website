import React from 'react'
import { useAuth } from "../Hooks/useAuth";
import { Navigate } from 'react-router';

const Protected = ({children}) => {
    const{loading, user} = useAuth()
    
 if (loading) {
  return (
    <main className="loading-container">
      <div className="loader"></div>
      <h2>Please wait...</h2>
      <p>We're processing your request.</p>
    </main>
  );
}

if(!user){
    return <Navigate to='/login'/>
}
    

  return  children
}

export default Protected