import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addItemsToCart, removeItemFromCart, removeMessage } from "../feature/cart/cartSlice";

function CartItem({ item }) {
  const { loading, error, message, success } = useSelector(
    (state) => state.cart,
  );
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const itemTotal = (item?.price || 0) * (item?.quantity || 0);
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot less than 1", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setQuantity((qty) => qty - 1);
  };
  // quantity increase by 1
  const increaseQuantity = () => {
    if (item.stock <= quantity) {
      toast.error("Cannot excees available stock", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const handleUpdate = () => {
    if (loading) return;

    if (quantity !== item.quantity) {
      dispatch(addItemsToCart({ id: item.product, quantity: quantity }));
    }
  };

  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000, toastId:'cart-update'
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleRemove=()=>{
    if(loading) return
    dispatch(removeItemFromCart(item.product));

  }
  return (
  <div className="px-6 py-4 flex flex-col md:grid md:grid-cols-4 gap-4 items-center hover:bg-[#03541e]/5 transition-all duration-200">

      {/* Product Info */}
      <div className="flex items-center gap-4 w-full">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6] shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-[#12351f] tracking-tight">{item.name}</h3>
          <p className="text-xs text-[#55705f]">₹{item.price.toFixed(2)}</p>
          <p className="text-xs text-[#55705f] md:hidden">Qty: <span className="text-[#12351f] font-medium">{item.quantity}</span></p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-0 border border-[#d7eadb] rounded-xl overflow-hidden bg-[#f4fbf6]">
          <button
            disabled={loading}
            onClick={decreaseQuantity}
            className="w-9 h-9 flex items-center justify-center text-[#12351f] hover:text-[#03541e] hover:bg-[#03541e]/10 transition-all duration-150 text-lg font-bold disabled:opacity-40"
          >
            −
          </button>
          <input
            type="number"
            readOnly
            value={quantity}
            className="w-10 h-9 text-center bg-transparent text-[#12351f] text-sm font-bold outline-none border-x border-[#d7eadb]"
          />
          <button
            disabled={loading}
            onClick={increaseQuantity}
            className="w-9 h-9 flex items-center justify-center text-[#12351f] hover:text-[#03541e] hover:bg-[#03541e]/10 transition-all duration-150 text-lg font-bold disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex items-center justify-center">
        <span className="text-[#03541e] font-bold text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2">
        <button
          disabled={loading || quantity === item.quantity}
          onClick={handleUpdate}
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#55705f]/40 text-[#12351f] hover:bg-[#03541e]/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          disabled={loading}
          onClick={handleRemove}
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-red-500/40 text-red-600 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Remove
        </button>
      </div>

    </div>
  );
}

export default CartItem;
