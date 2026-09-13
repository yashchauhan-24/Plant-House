import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../componant/PageTitle";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, removeError, removeSuccess } from "../feature/user/userSlice";

function Register() {
  const { error, loading, success } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = user;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  // ── Validation Rules ──
  const validate = () => {
    const errors = {};
    if (!name) errors.name = "Name is required";
    else if (name.trim().length < 3) errors.name = "Name must be at least 3 characters";

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";

    if (!password) errors.password = "Password is required";
    else {
      if (password.length < 8) errors.password = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(password)) errors.password = "Password must contain at least one capital letter";
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.password = "Password must contain at least one special character";
    }

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";

    if (!avatar) errors.avatar = "Profile photo is required";

    return errors;
  };

  const errors = validate();

  const isValid = (field) => !errors[field] && (touched[field] || submitAttempted);
  const showError = (field) => errors[field] && (touched[field] || submitAttempted);

  const registerDataChange = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setTouched((prev) => ({ ...prev, avatar: true }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ name: true, email: true, password: true, confirmPassword: true, avatar: true });

    if (Object.keys(validate()).length > 0) return;

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 2000 });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Registration successful! Redirecting to login...", { position: "top-right", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/login");
    }
  }, [success, dispatch, navigate]);

  // ── Password strength checks ──
  const pwChecks = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const inputClass = (field) =>
    `register-input w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200
    ${showError(field)
      ? "register-input-error"
      : isValid(field)
        ? "register-input-valid"
        : "register-input-default"
    }`;

  const iconClass = (field) =>
    `register-input-icon ${showError(field)
      ? "register-input-icon-error"
      : isValid(field)
        ? "register-input-icon-valid"
        : "register-input-icon-default"
    }`;

  return (
<div className="register-soft min-h-screen flex items-center justify-center px-4 py-16">
      <PageTitle title="Register" />
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl register-logo-wrap flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 register-logo-icon" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="register-card backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-10">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold register-heading tracking-tight">Sign Up</h2>
            <p className="mt-2 register-subheading text-sm">Create your account to get started.</p>
          </div>

          <form onSubmit={registerSubmit} encType="multipart/form-data" className="space-y-5" noValidate>

            {/* Name */}
            <div>
              <label className="register-label block text-xs font-semibold uppercase tracking-widest mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 ${iconClass('name')}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input
                  type="text" placeholder="Enter your username"
                  name="name" value={name} onChange={registerDataChange}
                  onBlur={() => setTouched(p => ({ ...p, name: true }))}
                  className={inputClass('name')}
                />
                {isValid('name') && (
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 register-success-text" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
              {showError('name') && <p className="mt-1.5 text-xs register-error-text flex items-center gap-1"><span>✕</span>{errors.name}</p>}
              {isValid('name') && <p className="mt-1.5 text-xs register-success-text flex items-center gap-1"><span>✓</span>Name looks good!</p>}
            </div>

            {/* Email */}
            <div>
              <label className="register-label block text-xs font-semibold uppercase tracking-widest mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 ${iconClass('email')}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email" placeholder="Enter your email"
                  name="email" value={email} onChange={registerDataChange}
                  onBlur={() => setTouched(p => ({ ...p, email: true }))}
                  className={inputClass('email')}
                />
                {isValid('email') && (
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 register-success-text" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
              {showError('email') && <p className="mt-1.5 text-xs register-error-text flex items-center gap-1"><span>✕</span>{errors.email}</p>}
              {isValid('email') && <p className="mt-1.5 text-xs register-success-text flex items-center gap-1"><span>✓</span>Email looks good!</p>}
            </div>

            {/* Password */}
            <div>
              <label className="register-label block text-xs font-semibold uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 ${iconClass('password')}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type="password" placeholder="Enter your password"
                  name="password" value={password} onChange={registerDataChange}
                  onBlur={() => setTouched(p => ({ ...p, password: true }))}
                  className={inputClass('password')}
                />
              </div>
              {/* Password strength checklist */}
              {(touched.password || submitAttempted) && password && (
                <div className="mt-2 flex flex-col gap-1">
                  <p className={`text-xs flex items-center gap-1.5 ${pwChecks.length ? 'register-success-text' : 'register-error-text'}`}>
                    <span>{pwChecks.length ? '✓' : '✕'}</span> At least 8 characters
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${pwChecks.capital ? 'register-success-text' : 'register-error-text'}`}>
                    <span>{pwChecks.capital ? '✓' : '✕'}</span> At least one capital letter
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${pwChecks.special ? 'register-success-text' : 'register-error-text'}`}>
                    <span>{pwChecks.special ? '✓' : '✕'}</span> At least one special character
                  </p>
                </div>
              )}
              {showError('password') && !password && <p className="mt-1.5 text-xs register-error-text flex items-center gap-1"><span>✕</span>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="register-label block text-xs font-semibold uppercase tracking-widest mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className={`w-4 h-4 ${iconClass('confirmPassword')}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type="password" placeholder="Confirm your password"
                  name="confirmPassword" value={confirmPassword} onChange={registerDataChange}
                  onBlur={() => setTouched(p => ({ ...p, confirmPassword: true }))}
                  className={inputClass('confirmPassword')}
                />
                {isValid('confirmPassword') && (
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 register-success-text" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
              {showError('confirmPassword') && <p className="mt-1.5 text-xs register-error-text flex items-center gap-1"><span>✕</span>{errors.confirmPassword}</p>}
              {isValid('confirmPassword') && <p className="mt-1.5 text-xs register-success-text flex items-center gap-1"><span>✓</span>Passwords match!</p>}
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="register-label block text-xs font-semibold uppercase tracking-widest mb-1.5">Avatar</label>
              <label className={`register-upload flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed cursor-pointer transition-all duration-200 text-xs font-semibold uppercase tracking-widest
                ${showError('avatar')
                  ? 'register-upload-error'
                  : isValid('avatar')
                    ? 'register-upload-valid'
                    : 'register-upload-default'
                }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {isValid('avatar') ? 'Photo uploaded!' : 'Upload Profile Photo'}
                <input type="file" accept="image/*" className="hidden" name="avatar" onChange={registerDataChange} />
              </label>
              {showError('avatar') && <p className="mt-1.5 text-xs register-error-text flex items-center gap-1"><span>✕</span>{errors.avatar}</p>}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="register-submit w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Registering...
                  </span>
                ) : "Sign Up"}
              </button>
            </div>

          </form>

          <p className="register-footer text-center text-xs mt-6">
            Already have an account?{" "}
            <Link to="/login" className="register-link font-semibold transition-colors duration-150">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;