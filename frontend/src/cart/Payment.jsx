import React, { useState } from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../componant/PageTitle'
import Navbar from '../componant/Navbar'
import Footer from '../componant/Footer'
import CheckoutPath from './CheckoutPath'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createOder } from '../feature/order/orderSlice'
import { clearCart } from '../feature/cart/cartSlice'

function Payment() {
    const OrderItem = JSON.parse(sessionStorage.getItem('orderItem'))
    const {user} = useSelector(state=>state.user)
    const {shippingInfo, cartItems} = useSelector(state=>state.cart)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const createCodOrder = async () => {
      try {
        if (!OrderItem || !cartItems?.length) {
          toast.error('Order details missing. Please go back and try again.', { position: 'top-right', autoClose: 3000 });
          return;
        }

        const orderData = {
          shipingInfo: {
            country: shippingInfo.country,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pincode: shippingInfo.pincode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItem: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            product: item.product,
          })),
          paymentInfo: {
            id: `COD-${Date.now()}`,
            status: 'pending',
            method: 'cash_on_delivery',
          },
          itemPrice: OrderItem.subTotal,
          taxPrice: OrderItem.tax,
          shippingPrice: OrderItem.shippingCharges,
          totalPrice: OrderItem.total,
        };

        await dispatch(createOder(orderData)).unwrap();
        dispatch(clearCart());
        sessionStorage.removeItem('orderItem');
        toast.success('Order placed with Cash on Delivery', { position: 'top-right', autoClose: 2000 });
        navigate('/orders/user');
      } catch (error) {
        const errorMessage = error?.message || error?.error || 'Failed to place order';
        toast.error(errorMessage, { position: 'top-right', autoClose: 4000 });
      }
    }

    const compltePayment=async(amount)=>{
      try {
        const finalAmount = Number(amount)
        if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
          toast.error('Invalid payment amount', { position: 'top-right', autoClose: 3000 });
          return
        }

        const {data: keyData} = await axios.get('/api/v1/getKey')
        const {key }= keyData;
        const {data:orderData} = await axios.post('/api/v1/payment/process', { amount: finalAmount })
        const {order } = orderData
        const options = {
          key, // Replace with your Razorpay key_id
          amount: order.amount, // Amount is in currency subunits.
          currency: 'INR',
            name: "Plant House",
          description: 'E-commerce',
          order_id: order.id, // This is the order_id created in the backend
          // callback_url: '/api/v1/paymentVerification', // Your success URL
          handler: async function (response) {
            try {
              const {data} = await axios.post('/api/v1/paymentVerification',{
                razorpay_payment_id : response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature : response.razorpay_signature
              })
              if(data.success){
                navigate(`/paymentSuccess?reference=${data.reference}`)
              }else{
                toast.error("Payment verification failed", { position: 'top-right', autoClose: 4000 });
              }
            } catch (error) {
              toast.error("Payment verification error", { position: 'top-right', autoClose: 4000 });
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: shippingInfo.phoneNumber
          },
          theme: {
            color: '#03541e'
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message || 'Payment failed';
        console.error(errorMessage);
        toast.error(errorMessage, { position: 'top-right', autoClose: 4000 });
      }
    }

    const handlePaymentAction = async () => {
      if (!paymentMethod) {
        toast.error('Please choose one payment option.', { position: 'top-right', autoClose: 2500 });
        return;
      }

      setIsProcessing(true);
      try {
        if (paymentMethod === 'online') {
          await compltePayment(OrderItem?.total);
        } else {
          await createCodOrder();
        }
      } finally {
        setIsProcessing(false);
      }
    }
    
  return (
<>
    <PageTitle title="Payment Processing"/>
    <Navbar />
    <CheckoutPath activePath={2}/>

    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/15 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#d7eadb] flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-[#03541e]" />
          <h2 className="text-lg font-bold text-[#12351f] tracking-tight">Payment</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col gap-4">

          {/* Total Amount Display */}
          <div className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-5 py-4 flex items-center justify-between">
            <span className="text-sm text-[#55705f] font-medium">Amount to Pay</span>
            <span className="text-2xl font-extrabold text-[#03541e]">₹{Number(OrderItem?.total || 0).toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Choose One Payment Option</p>

            <label className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 ${paymentMethod === 'cash_on_delivery' ? 'border-[#03541e] bg-[#03541e]/10' : 'border-[#d7eadb] bg-[#f4fbf6]'}`}>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#12351f]">Cash on Delivery</span>
                <span className="text-xs text-[#55705f]">Pay when your order arrives</span>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-[#03541e]"
              />
            </label>

            <label className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 ${paymentMethod === 'online' ? 'border-[#03541e] bg-[#03541e]/10' : 'border-[#d7eadb] bg-[#f4fbf6]'}`}>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#12351f]">Online Payment</span>
                <span className="text-xs text-[#55705f]">Pay securely with Razorpay</span>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-[#03541e]"
              />
            </label>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePaymentAction}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#12351f] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : paymentMethod === 'cash_on_delivery' ? 'Place COD Order' : `Pay ₹${Number(OrderItem?.total || 0).toFixed(2)}`}
          </button>

          {/* Go Back Link */}
          <Link
            to="/order/confirm"
            className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-center border border-[#D4C3A7] text-[#55705f] hover:border-[#03541e]/70 hover:text-[#12351f] transition-all duration-200"
          >
            Go Back
          </Link>

        </div>
      </div>
    </div>

    <Footer />
    </>
  )
}

export default Payment
