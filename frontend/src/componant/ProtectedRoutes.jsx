import React from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes({element, adminOnly = false}) {
    const {loading, isAuthenticated,user}= useSelector(state=>state.user)
    if(loading){
        return<Loader />
    }
    if (!isAuthenticated){
        return <Navigate to={adminOnly ? '/admin/login' : '/login'} />
    }
    if(adminOnly && user?.role !== 'admin'){
        return <Navigate to='/admin/login' />
    }
  return element
    
}

export default ProtectedRoutes
