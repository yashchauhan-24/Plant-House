import React, { useEffect } from 'react'
import '../AdminStyles/UsersList.css'
import PageTitle from '../componant/PageTitle'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import People from '@mui/icons-material/People'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteUser, fetchUser, removeError, removeSuccess } from '../feature/admin/adminSlice'
import Loader from "../componant/Loader";
import { toast } from 'react-toastify'
import AdminShell from './components/AdminShell'

function UserList() {
    const {users, loading, error,success,message}= useSelector(state=>state.admin)
    
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchUser())
    },[dispatch])

    useEffect(() => {
        if (error) {
          toast.error(error?.message || error, {
            position: "top-right",
            autoClose: 2000,
          });
    
          dispatch(removeError());
        }
      }, [error, dispatch]);

      const handleDelete=(userId)=>{
        const confirm= window.confirm("Are You sure delete this user?")
        if(confirm){
            dispatch(deleteUser(userId))
        }
}

useEffect(() => {
     if (success) {
          toast.success(message, {
            position: "top-right",
            autoClose: 2000,
          });
          dispatch(removeSuccess());
          dispatch(clearMessage());
          dispatch(fetchUser());
        }
      }, [ dispatch, success, message]); 

  return (
<>
    <PageTitle title="All Users" />
    <AdminShell>
    {loading ? (<Loader />) : (
    <>
    <div className="px-0">
      <div className="w-full flex flex-col gap-6">

        {/* Heading */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-[#03541e]" />
          <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">All Users</h1>
        </div>

        {/* Table Card */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d7eadb]">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Sl No.</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Created At</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7eadb]">
                {users?.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-[#f4fbf6] transition-all duration-150">

                      <td className="px-6 py-4 text-[#55705f]">{index + 1}</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center text-xs font-bold text-[#03541e] shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[#12351f] font-medium">{user.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[#12351f]">{user.email}</td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                          ${user.role === 'admin'
                            ? 'bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]'
                            : 'bg-[#eaf7ed] border border-[#d7eadb] text-[#12351f]'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-[#03541e]' : 'bg-[#55705f]'}`} />
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#55705f] text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-all duration-200"
                          >
                            <Edit style={{fontSize: 16}} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200"
                          >
                            <Delete style={{fontSize: 16}} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#eaf7ed] border border-[#d7eadb] flex items-center justify-center">
                          <People style={{fontSize: 24}} className="text-[#55705f]" />
                        </div>
                        <p className="text-sm text-[#55705f]">No users found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    </>
    )}
    </AdminShell>
    </>
  ) 
}

export default UserList
