import React, { useEffect, useState } from 'react'
import "../AdminStyles/UpdateOrder.css";
import PageTitle from '../componant/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderDetails, removeError } from '../feature/order/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../componant/Loader';
import { removeSuccess, updateOrderStatus } from '../feature/admin/adminSlice';
import AdminShell from './components/AdminShell';
function UpdateOrderStatus() {
    const [status, setStatus]=useState('')
    const {order, loading:orderLoading, error}= useSelector(state=>state.order)
    const {success, loading:adminLoading, error:adminError, message}= useSelector(state=>state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {orderId}=useParams()
    const cleanOrderId = orderId?.replace(/[{}]/g, '').trim()
    const loading = orderLoading || adminLoading

    useEffect(()=>{
        if(cleanOrderId){
            dispatch(getOrderDetails(cleanOrderId))
        }
    },[dispatch,cleanOrderId])

    useEffect(() => {
        if (error) {
            toast.error(error?.message || error, {
                position: 'top-right',
                autoClose: 2500,
            })
            dispatch(removeError())
        }
    }, [error, dispatch])

    const shippingInfo = order?.shipingInfo || order?.shippingInfo || {}
    const orderItems = order?.orderItem || order?.orderItems || []
    const getOrderItemImage = (item) => {
      if (!item) return '/images/no-products.png'
      if (typeof item.image === 'string' && item.image.trim()) return item.image
      if (typeof item.image === 'object' && item.image?.url) return item.image.url
      if (typeof item?.product?.image === 'string' && item.product.image.trim()) return item.product.image
      if (Array.isArray(item?.product?.image) && item.product.image[0]?.url) return item.product.image[0].url
      if (item?.product?.image?.url) return item.product.image.url
      return '/images/no-products.png'
    }

    const {
        paymentInfo = {},
        orderStatus,
        totalPrice,
        paidAt
    } = order

    const normalizedPaymentStatus = paymentInfo?.status?.toString().trim().toLowerCase()
    const isPaid =
        ['succeeded', 'success', 'paid', 'captured', 'completed', 'succed'].includes(normalizedPaymentStatus) ||
        Boolean(paymentInfo?.id) ||
        Boolean(paidAt)
    const paymentStatus = isPaid ? 'Paid' : 'Not Paid'

    useEffect(() => {
        if (orderStatus) {
            setStatus(orderStatus)
        }
    }, [orderStatus])
    
    const handleStatusUpdate = ()=>{
        if(!status){
            toast.error("please select a status", {position:"top-right", autoClose:2000})
            return;
        }
                dispatch(updateOrderStatus({orderId: cleanOrderId, status}))
    }

        useEffect(() => {
                if (adminError) {
                        toast.error(adminError?.message || adminError, {
                                position: 'top-right',
                                autoClose: 2500,
                        })
                }
        }, [adminError])

        useEffect(() => {
                if (success) {
                        toast.success(message || 'order status Updated Successfully', {
                                position: 'top-right',
                                autoClose: 2000,
                        })
                        dispatch(removeSuccess())
            navigate('/admin/orders')
                }
        }, [success, message, dispatch, navigate])

    
  return (
<>
   <PageTitle title='Update Order Status' />
   <AdminShell>
   { loading ? (<Loader />):( <>
    <div className="px-0">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Heading */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-[#03541e]" />
          <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Update Order</h1>
        </div>

        {/* ── Order Information ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d7eadb]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Information</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-3">

            <div className="flex items-start justify-between py-2 border-b border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order ID</span>
              <span className="text-[#12351f] font-mono text-xs">{cleanOrderId}</span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Shipping Address</span>
              <span className="text-[#12351f] text-sm text-right max-w-xs">
                {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Phone</span>
              <span className="text-[#12351f] text-sm">{shippingInfo.phoneNo}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                ${orderStatus?.toLowerCase() === 'delivered'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                  : orderStatus?.toLowerCase() === 'processing'
                    ? 'bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]'
                    : orderStatus?.toLowerCase() === 'shipped'
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500'
                      : 'bg-[#eaf7ed] border border-[#d7eadb] text-[#55705f]'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full
                  ${orderStatus?.toLowerCase() === 'delivered' ? 'bg-emerald-500'
                    : orderStatus?.toLowerCase() === 'processing' ? 'bg-[#03541e] animate-pulse'
                    : orderStatus?.toLowerCase() === 'shipped' ? 'bg-blue-500'
                    : 'bg-[#55705f]'}`}
                />
                {orderStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Payment Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                ${paymentStatus?.toLowerCase() === 'paid'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                  : 'bg-red-500/10 border border-red-500/20 text-red-500'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${paymentStatus?.toLowerCase() === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Total Price</span>
              <span className="text-[#03541e] font-bold text-base">₹{totalPrice}</span>
            </div>

          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d7eadb]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d7eadb]">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Image</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Quantity</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7eadb]">
                {orderItems.map((item) => (
                  <tr key={item.product || item._id} className="hover:bg-[#f4fbf6] transition-all duration-150">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6]">
                        <img
                          src={getOrderItemImage(item)}
                          alt={item.name || 'Order Item'}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.currentTarget.src = '/images/no-products.png'
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#12351f] font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-[#12351f]">{item.quantity}</td>
                    <td className="px-6 py-4 text-[#03541e] font-bold">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Update Status ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d7eadb]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Update Order Status</p>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-4">
            <select
              disabled={loading || orderStatus === 'Delivered'}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Select Status</option>
              <option value="Shipped">Shipped</option>
              <option value="On the way">On the way</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button
              disabled={loading || orderStatus === 'Delivered'}
              onClick={handleStatusUpdate}
              className="px-8 py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#f4fbf6] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

      </div>
    </div>
    </>)}
    </AdminShell>
    </>
  )
}

export default UpdateOrderStatus
