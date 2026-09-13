import React, { useEffect } from 'react'
import PageTitle from '../componant/PageTitle'
import { CheckCircle, CurrencyRupee, Error, Inventory, People, ShoppingCart, Star } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, fetchAllProducts, fetchCategories, fetchUser } from '../feature/admin/adminSlice'
import AdminShell from './components/AdminShell'

export default function Dashboard() {
  const {orders = [], products = [], users = [], categories = [], totalAmount = 0}= useSelector(state=>state.admin)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchAllProducts())
        dispatch(fetchAllOrders())
        dispatch(fetchUser())
        dispatch(fetchCategories())
    }, [dispatch])

    const totalUsers = users.length;
    const totalCategories = categories.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const confirmedOrders = orders.filter((order) => !order.isCancelled);
    const cancelledOrders = orders.filter((order) => order.isCancelled);
    const confirmedOrderCount = confirmedOrders.length;
    const cancelledOrderCount = cancelledOrders.length;
    const cancelledOrderAmount = cancelledOrders.reduce((total, order) => total + Number(order.totalPrice || 0), 0);
    const outOfStock = products.filter((product) => Number(product?.stock) <= 0).length;
    const inStock = products.filter((product) => Number(product?.stock) > 0).length;
    const totalReview = products.reduce((acc, product) => acc + (product.Reviews?.length || 0), 0)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

    const getStatusClass = (status = '') => {
      const normalized = status.toLowerCase();
      if (normalized === 'delivered') return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600';
      if (normalized === 'processing') return 'bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]';
      if (normalized === 'shipped') return 'bg-blue-500/10 border border-blue-500/20 text-blue-600';
      if (normalized === 'cancelled') return 'bg-red-500/10 border border-red-500/20 text-red-500';
      return 'bg-[#eaf7ed] border border-[#d7eadb] text-[#12351f]';
    }

  return (
<>
    <PageTitle title='Admin Dashboard'/>
    <AdminShell>
        <div className="w-full flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[#03541e]" />
            <h2 className="text-base font-bold text-[#12351f] tracking-tight">Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <People className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Users</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{totalUsers}</p>
            </div>

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <Inventory className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Products</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{totalProducts}</p>
            </div>

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <Star className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Categories</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{totalCategories}</p>
            </div>

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <ShoppingCart className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Orders</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{totalOrders}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-4">

            <div className="bg-[#ffffff] border border-emerald-500/20 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <CheckCircle className="text-emerald-500" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Confirmed Orders</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{confirmedOrderCount}</p>
            </div>

            <div className="bg-[#ffffff] border border-red-400/20 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <Error className="text-red-500" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Cancelled Orders</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{cancelledOrderCount}</p>
            </div>

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <Star className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Total Reviews</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{totalReview}</p>
            </div>

            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <CurrencyRupee className="text-[#03541e]" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Total Revenue</p>
              <p className="text-2xl font-extrabold text-[#12351f]">₹{Number(totalAmount || 0).toFixed(2)}</p>
            </div>

            <div className="bg-[#ffffff] border border-red-400/20 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <CurrencyRupee className="text-red-500" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Cancelled Amount</p>
              <p className="text-2xl font-extrabold text-[#12351f]">₹{cancelledOrderAmount.toFixed(2)}</p>
            </div>

            <div className="bg-[#ffffff] border border-red-400/20 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <Error className="text-red-500" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Out of Stock</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{outOfStock}</p>
            </div>

            <div className="bg-[#ffffff] border border-emerald-500/20 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
              <CheckCircle className="text-emerald-500" style={{fontSize: 22}} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">In Stock</p>
              <p className="text-2xl font-extrabold text-[#12351f]">{inStock}</p>
            </div>

          </div>
        </div>

        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d7eadb] flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Recent Orders</p>
            <Link
              to="/admin/orders"
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-[#03541e]/30 text-[#03541e] hover:bg-[#03541e]/10 transition-all duration-200"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d7eadb]">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Order #</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Status</th>
                  <th className="text-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7eadb]">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#f4fbf6] transition-all duration-150">
                      <td className="px-6 py-4 text-[#12351f] font-mono text-xs">{order._id?.slice(-8)}</td>
                      <td className="px-6 py-4 text-[#12351f] font-medium">{order?.user?.name || 'Customer'}</td>
                      <td className="px-6 py-4 text-[#55705f] text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right text-[#12351f] font-semibold">₹{Number(order.totalPrice || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-[#03541e]/20 text-[#03541e] hover:bg-[#03541e] hover:text-[#ffffff] transition-all duration-200"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-[#55705f]">No recent orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  </>
  )
}
