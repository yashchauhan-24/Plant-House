import React from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes({element, adminOnly = false}) {
    const {loading, isAuthenticated,user}= useSelector(state=>state.user)
    const token = localStorage.getItem(adminOnly ? "adminToken" : "userToken");
    if(loading){
        return<Loader />
    }
    if (!isAuthenticated || !token){
        return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
    }
    if ((adminOnly && user?.role !== 'admin') || (!adminOnly && user?.role === 'admin')){
        return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
    }
  return element
}

export function PublicAuthRoute({ element, adminOnly = false }) {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    const token = localStorage.getItem(adminOnly ? "adminToken" : "userToken");
    if (loading) return <Loader />;
    if (isAuthenticated && token && (!adminOnly || user?.role === "admin")) {
        return <Navigate to={adminOnly ? "/admin/dashboard" : "/"} replace />;
    }
    return element;
}

export default ProtectedRoutes
