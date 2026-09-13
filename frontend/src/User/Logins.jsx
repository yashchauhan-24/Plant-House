import { useState } from "react";
import { Link } from "react-router-dom";
import "../UserStyles/Form.css";

function Login() {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginpass, setLoginPass] = useState("");
  const [errors, setErrors] = useState({});

  const loginSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    // Email Validation
    if (!loginEmail) {
      newErrors.email = "Email is required";
    } 
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      newErrors.email = "Enter a valid email";
    }

    // Password Validation
    if (!loginpass) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login Successful");
    }
  };

  return (
    <div className="form-container container">
      <div className="form-content">

        <form onSubmit={loginSubmit} className="form">

          <h2>Sign In</h2>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              value={loginpass}
              placeholder="Password"
              onChange={(e) => setLoginPass(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button className="authBtn">Sign In</button>

          <p className="form-links">
            Forgot Password? <Link to="/forgot/password">Reset Here</Link>
          </p>

          <p className="form-links">
            Don't Have Account? <Link to="/register">Sign Up</Link>
          </p>

        </form>

      </div>    
    </div>
  );
}

export default Login;