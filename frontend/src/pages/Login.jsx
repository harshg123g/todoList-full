// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// function Login({ onLogin }) {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");

//     if (!form.email || !form.password) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await onLogin({
//         email: form.email,
//         password: form.password,
//       });

//       navigate("/dashboard");
//     } catch (e) {
//       setError(e.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">

//         {/* LEFT SIDE */}

//         <div className="auth-brand">
//           <div className="brand-icon">✓</div>

//           <span className="eyebrow">PRODUCTIVITY APP</span>

//           <h1>
//             Get things done.
//             <br />
//             One task at a time.
//           </h1>

//           <p>
//             Organize your work, track your progress and
//             stay focused with your personal todo dashboard.
//           </p>

//           <div className="feature-list">
//             <div className="feature">
//               <span>✓</span>
//               <div>
//                 <strong>Simple task management</strong>
//                 <small>Create and organize tasks easily.</small>
//               </div>
//             </div>

//             <div className="feature">
//               <span>✓</span>
//               <div>
//                 <strong>Track your progress</strong>
//                 <small>Mark tasks complete as you go.</small>
//               </div>
//             </div>

//             <div className="feature">
//               <span>✓</span>
//               <div>
//                 <strong>Everything in one place</strong>
//                 <small>Manage your daily tasks from one dashboard.</small>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="auth-card">

//           <div className="auth-header">
//             <span className="mobile-eyebrow">TODO LIST</span>

//             <h2>Welcome back</h2>

//             <p>
//               Sign in to continue to your dashboard.
//             </p>
//           </div>

//           {error && (
//             <div className="alert error">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             <div className="input-group">
//               <label>Email address</label>

//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     email: e.target.value,
//                   })
//                 }
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <div className="label-row">
//                 <label>Password</label>

//                 <span className="forgot-password">
//                   Forgot password?
//                 </span>
//               </div>

//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={form.password}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     password: e.target.value,
//                   })
//                 }
//                 autoComplete="current-password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="primary auth-submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="button-spinner"></span>
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </form>

//           <div className="divider">
//             <span>OR</span>
//           </div>

//           <div className="auth-switch">
//             <span>Don't have an account?</span>

//             <Link to="/signup">
//               Create an account
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await onLogin(form);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <div className="brand-icon">✓</div>
          <span>TODO LIST</span>
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to manage your tasks.</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;