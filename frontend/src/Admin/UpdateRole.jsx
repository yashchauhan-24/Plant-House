import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateRole.css'
import PageTitle from '../componant/PageTitle'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useFormValidation from '../utils/useFormValidation'
import { clearMessage, getSingleUser, removeError, removeSuccess, updateUserRole } from '../feature/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../componant/Loader'
import AdminShell from './components/AdminShell'

function UpdateRole() {
  const { id } = useParams()
    const {user, loading,error, success, message} =useSelector(state=>state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
      if (id) {
        dispatch(getSingleUser(id))
      }
    },[dispatch, id])

    useEffect(()=>{
        if(user){
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            })
        }
    }, [user])
    const [formData, setFormData]=useState({
        name: "",
        email: "",
        role: ""
    })
    const {name,email,role}= formData

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const updateRoleHandler = () => {
      dispatch(updateUserRole({userId: id, role}))
    }

    const validationRules = {
      rules: {
        role: { required: true }
      },
      messages: {
        role: "Please select a valid role"
      }
    };

    const formRef = useFormValidation(validationRules, updateRoleHandler);

  
     useEffect(() => {
        if (error) {
          toast.error(message , {
            position: "top-right",
            autoClose: 2000,
          });
      
          dispatch(removeError());
        }
        if (success) {
          toast.success("User Profile Updated Successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          dispatch(removeSuccess());
          dispatch(clearMessage());
          navigate('/admin/users')
        }
      }, [error, dispatch, success, message]); 
      return (
<>
   <PageTitle title='Update Role'/>
   <AdminShell>
   {loading?(<Loader />): (<>
  <div className="px-0 flex items-start justify-center">
      <div className="w-full max-w-md flex flex-col gap-6 mt-4">

        {/* Heading */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-[#03541e]" />
          <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Update User Role</h1>
        </div>

        {/* Card */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d7eadb]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">User Details</p>
          </div>

          <form className="px-6 py-6 flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Name</label>
              <input
                value={name} id="name" type="text" name="name"
                required readOnly
                className="bg-[#eaf7ed] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#55705f] outline-none cursor-not-allowed opacity-70"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Email</label>
              <input
                value={email} id="email" type="text" name="email"
                required readOnly
                className="bg-[#eaf7ed] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#55705f] outline-none cursor-not-allowed opacity-70"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Role</label>
              <select
                value={role} onChange={handleChange} name="role" id="role" required
                className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200 cursor-pointer"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#d7eadb]" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#f4fbf6] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]"
            >
              Update Role
            </button>

          </form>
        </div>
      </div>
    </div>
    </>)}
    </AdminShell>
    </>
  )
}

export default UpdateRole
