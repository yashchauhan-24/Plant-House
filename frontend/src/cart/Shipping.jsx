import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import Navbar from "../componant/Navbar";
import PageTitle from "../componant/PageTitle";
import CheckoutPath from "./CheckoutPath";
import { Country, State, City }  from 'country-state-city';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../feature/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../utils/useFormValidation";

function Shipping() {
  const {shippingInfo} = useSelector(state=> state.cart)
    const [address, setAddress]=useState(shippingInfo.address || "");
    const [pincode, setPincode]=useState(shippingInfo.pincode || "");
    const [phoneNumber, setPhoneNumber]=useState(shippingInfo.phoneNumber || "");
    const [country, setCountry]=useState(shippingInfo.country || "");
    const [state, setState]=useState(shippingInfo.state || "");
    const [city, setCity]=useState(shippingInfo.city || "");
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const shippingValidationRules = {
      rules: {
        address: {
          required: true,
          minlength: 5
        },
        pincode: {
          required: true,
          digits: true,
          minlength: 6,
          maxlength: 6
        },
        phoneNumber: {
          required: true,
          digits: true,
          minlength: 10,
          maxlength: 10
        },
        country: {
          required: true
        },
        state: {
          required: true
        },
        city: {
          required: true
        }
      },
      messages: {
        address: {
          required: "Address is required",
          minlength: "Address must be at least 5 characters"
        },
        pincode: {
          required: "Pincode is required",
          digits: "Pincode must contain only digits",
          minlength: "Pincode must be exactly 6 digits",
          maxlength: "Pincode must be exactly 6 digits"
        },
        phoneNumber: {
          required: "Phone number is required",
          digits: "Phone number must contain only digits",
          minlength: "Phone number must be exactly 10 digits",
          maxlength: "Phone number must be exactly 10 digits"
        },
        country: {
          required: "Please select a country"
        },
        state: {
          required: "Please select a state"
        },
        city: {
          required: "Please select a city"
        }
      }
    };

    const shippingInfoSubmitHandler = () => {
      dispatch(saveShippingInfo({
        address: address.trim(),
        pincode: String(pincode).trim(),
        phoneNumber: phoneNumber.trim(),
        country,
        state,
        city,
      }))
      navigate('/order/confirm')
    };

    const formRef = useFormValidation(shippingValidationRules, shippingInfoSubmitHandler);
  return (
    <>
      <Navbar />
      <CheckoutPath activePath={0}/>
      <PageTitle title="Shipping Details" />

      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 pt-6 pb-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* Heading */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-[#03541e]" />
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Shipping Details</h1>
          </div>

          <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

            {/* ── Section 1: Address Info ── */}
            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#d7eadb]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Address Info</p>
              </div>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Your Address"
                    className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#A67D5B] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pincode" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Pincode</label>
                  <input
                    type="number"
                    id="pincode"
                    name="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Your Pincode"
                    className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#A67D5B] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter Your Phone Number"
                    className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#A67D5B] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200"
                  />
                </div>

              </div>
            </div>

            {/* ── Section 2: Location ── */}
            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#d7eadb]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Location</p>
              </div>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Country */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Country</label>
                  <select
                    name="country" id="country" value={country}
                    onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }}
                    className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Select a Country</option>
                    {Country && Country.getAllCountries().map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                {country && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">State</label>
                    <select
                      name="state" id="state" value={state}
                      onChange={(e) => { setState(e.target.value); setCity(""); }}
                      className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select a State</option>
                      {State && State.getStatesOfCountry(country).map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* City */}
                {state && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">City</label>
                    <select
                      name="city" id="city" value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/70 focus:ring-1 focus:ring-[#03541e]/30 transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select a City</option>
                      {City && City.getCitiesOfState(country, state).map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-10 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#12351f] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/30 active:scale-[0.98]"
              >
                Continue
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default Shipping;
