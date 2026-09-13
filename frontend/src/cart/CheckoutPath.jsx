import React from "react";
import "../CartStyles/CheckoutPath.css";
import {
  AccountBalance,
  LibraryAddCheck,
  LocalShipping,
} from "@mui/icons-material";
function CheckoutPath({activePath}) {
  const path = [
    { label: "Shipping Details", icon: <LocalShipping /> },
    { label: "Confirm Order", icon: <LibraryAddCheck /> },
    { label: "Payment", icon: <AccountBalance /> },
  ];
  return (
<div className="mt-15 flex items-center justify-center px-4 py-6 bg-slate-900">
      {path.map((item, index) => (
        <div key={index} className="flex items-center">

          {/* Step */}
          <div
            className="flex flex-col items-center gap-1.5"
            active={activePath === index ? 'true' : 'false'}
            completed={activePath >= index ? 'true' : 'false'}
          >
            {/* Icon Circle */}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
              ${activePath === index
                ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-lg shadow-amber-400/30'
                : activePath > index
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-600 text-slate-500'
              }`}
            >
              {item.icon}
            </div>

            {/* Label */}
            <p className={`text-xs font-semibold tracking-wide transition-all duration-300
              ${activePath === index
                ? 'text-amber-400'
                : activePath > index
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              {item.label}
            </p>
          </div>

          {/* Connector Line (not after last item) */}
          {index < path.length - 1 && (
            <div className={`w-16 md:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300
              ${activePath > index ? 'bg-emerald-500' : 'bg-slate-700'}`}
            />
          )}

        </div>
      ))}
    </div>
  );
}

export default CheckoutPath;
