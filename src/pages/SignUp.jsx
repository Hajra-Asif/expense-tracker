import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaShieldAlt, FaMoneyBillWave, FaChartLine, FaRegCheckCircle } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  // inside SignUp component
  const navigate = useNavigate();

  // replace handleSignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        uid: user.uid,
      });

      navigate("/"); // Redirect after successful signup
    } catch (error) {
      alert("Sign Up Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // replace handleGoogleSignUp
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName || "",
        email: user.email,
        uid: user.uid,
      });

      navigate("/"); // Redirect after Google signup
    } catch (error) {
      alert("Google Sign-Up Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="signup-wrapper"
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        color: "#ffffff",
      }}
    >
      <div
        className="signup-container"
        style={{
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          height: "85vh",
          minHeight: "750px",
          backgroundColor: "#1e1e1e"
        }}
      >
        {/* Left side: form panel */}
        <div
          className="form-panel"
          style={{
            flex: "1",
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            background: "#1e1e1e",
            zIndex: "1",
          }}
        >
          <div className="form-wrapper" style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
            <div className="d-flex align-items-center mb-5">
              <div
                className="logo-circle"
                style={{
                  backgroundColor: "rgba(46, 204, 113, 0.15)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px"
                }}
              >
                <FaMoneyBillWave size={24} style={{ color: "#2ecc71" }} />
              </div>
              <h3 style={{ margin: "0", fontWeight: "600", color: "#ffffff" }}>Ayesha's Tracker</h3>
            </div>

            <h1
              style={{
                fontWeight: "700",
                marginBottom: "12px",
                paddingTop: "20px",
                fontSize: "2.4rem",
                backgroundImage: "linear-gradient(to right, #2ecc71, #27ae60)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </h1>
            <p style={{ color: "#a0a0a0", marginBottom: "2.5rem", fontSize: "1.1rem" }}>
              Join thousands of users tracking their expenses wisely
            </p>

            <form onSubmit={handleSignUp}  className="my-4 pb-5">
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="d-block mb-2"
                  style={{ color: "#d4d4d4", fontWeight: "500", fontSize: "0.95rem" }}
                >
                  Full Name
                </label>
                <div className="input-wrapper" style={{ position: "relative" }}>
                  <FaUser
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#2ecc71",
                      zIndex: "2"
                    }}
                  />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your full name"
                    style={{
                      width: "100%",
                      padding: "14px 14px 14px 45px",
                      borderRadius: "12px",
                      border: "1px solid #333333",
                      backgroundColor: "#252525",
                      color: "#ffffff",
                      fontSize: "1rem",
                      transition: "all 0.2s ease"
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="d-block mb-2"
                  style={{ color: "#d4d4d4", fontWeight: "500", fontSize: "0.95rem" }}
                >
                  Email Address
                </label>
                <div className="input-wrapper" style={{ position: "relative" }}>
                  <FaEnvelope
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#2ecc71",
                      zIndex: "2"
                    }}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your email"
                    style={{
                      width: "100%",
                      padding: "14px 14px 14px 45px",
                      borderRadius: "12px",
                      border: "1px solid #333333",
                      backgroundColor: "#252525",
                      color: "#ffffff",
                      fontSize: "1rem",
                      transition: "all 0.2s ease"
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="d-block mb-2"
                  style={{ color: "#d4d4d4", fontWeight: "500", fontSize: "0.95rem" }}
                >
                  Password
                </label>
                <div className="input-wrapper" style={{ position: "relative" }}>
                  <FaLock
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#2ecc71",
                      zIndex: "2"
                    }}
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                    style={{
                      width: "100%",
                      padding: "14px 14px 14px 45px",
                      borderRadius: "12px",
                      border: "1px solid #333333",
                      backgroundColor: "#252525",
                      color: "#ffffff",
                      fontSize: "1rem",
                      transition: "all 0.2s ease"
                    }}
                  />
                </div>
                <small style={{ color: "#a0a0a0", fontSize: "0.85rem", display: "block", marginTop: "8px", marginLeft: "5px" }}>
                  Use 8+ characters with a mix of letters, numbers & symbols
                </small>
              </div>

              <button
                type="submit"
                className="w-100 mt-4"
                disabled={isLoading}
                style={{
                  backgroundColor: "#2ecc71",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(46, 204, 113, 0.25)"
                }}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="position-relative text-center my-4">
                <hr style={{ borderColor: "#333333", margin: "0" }} />
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#1e1e1e",
                    padding: "0 15px",
                    color: "#a0a0a0",
                    fontSize: "0.9rem"
                  }}
                >
                  OR
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-100 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "1px solid #333333",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <FaGoogle style={{ marginRight: "10px", color: "#2ecc71" }} />
                Sign up with Google
              </button>

              <p className="text-center py-4" style={{ color: "#a0a0a0", fontSize: "0.95rem" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#2ecc71", textDecoration: "none", fontWeight: "500" }}>
                  Log in
                </Link>
              </p>

             
            </form>
          </div>
        </div>

        {/* Right side: Feature showcase */}
        <div
          className="feature-panel d-none d-md-flex"
          style={{
            flex: "1.2",
            backgroundColor: "#161b16",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at 30% 40%, rgba(46, 204, 113, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
              zIndex: 1
            }}
          ></div>

          {/* Decorative pattern */}
          <div
            className="geometric-pattern"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.07,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232ecc71' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              zIndex: 0
            }}
          ></div>

          <div
            className="content-wrapper"
            style={{
              zIndex: 2,
              maxWidth: "500px",
              padding: "2.5rem",
              position: "relative"
            }}
          >
            <div
              className="feature-icon mb-4"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "24px",
                backgroundColor: "rgba(46, 204, 113, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem"
              }}
            >
              <FaMoneyBillWave size={40} style={{ color: "#2ecc71" }} />
            </div>

            <h2 style={{ fontWeight: "700", fontSize: "2.5rem", marginBottom: "1.5rem", lineHeight: "1.2" }}>
              Join Our <br />Financial <span style={{ color: "#2ecc71" }}>Community</span>
            </h2>

            <p style={{ fontSize: "1.1rem", color: "#c0c0c0", marginBottom: "2.5rem", lineHeight: "1.6" }}>
              Create your account today and start your journey to financial freedom with smart
              expense tracking and personalized insights.
            </p>

            <div className="features-list">
              <div className="feature-item d-flex align-items-start mb-4">
                <div
                  className="feature-icon-small"
                  style={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(46, 204, 113, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    marginTop: "5px"
                  }}
                >
                  <FaRegCheckCircle size={16} style={{ color: "#2ecc71" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>Free Forever Plan</h3>
                  <p style={{ color: "#a0a0a0", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    Start with our robust free plan that includes all essential tracking features
                    and basic analytics.
                  </p>
                </div>
              </div>

              <div className="feature-item d-flex align-items-start mb-4">
                <div
                  className="feature-icon-small"
                  style={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(46, 204, 113, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    marginTop: "5px"
                  }}
                >
                  <FaRegCheckCircle size={16} style={{ color: "#2ecc71" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>Quick Setup</h3>
                  <p style={{ color: "#a0a0a0", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    Get started in minutes with our intuitive onboarding and automated
                    expense categorization.
                  </p>
                </div>
              </div>

              <div className="feature-item d-flex align-items-start">
                <div
                  className="feature-icon-small"
                  style={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(46, 204, 113, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    marginTop: "5px"
                  }}
                >
                  <FaRegCheckCircle size={16} style={{ color: "#2ecc71" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>Data Privacy</h3>
                  <p style={{ color: "#a0a0a0", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    Your financial data stays private with our secure encryption and
                    strict privacy policies.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}