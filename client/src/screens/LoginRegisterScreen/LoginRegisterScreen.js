import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GoMarkGithub } from "react-icons/go";
import { FaFacebook } from "react-icons/fa";
import "./LoginRegisterScreen.scss";

const LoginRegisterScreen = ({ history }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [isActive, setActive] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/");
    }
  }, [history]);

  const registerHandler = async (e) => {
    e.preventDefault();
    console.log("Register hander called");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (registerPassword !== registerConfirmPassword) {
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setTimeout(() => {
        setRegisterError("");
      }, 5000);
      return setRegisterError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        "/api/auth/register",
        {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        },
        config
      );

      // localStorage.setItem("userInfo", JSON.stringify(data));
      // localStorage.setItem("token", JSON.stringify(data.token));

      history.push("/");
    } catch (error) {
      setRegisterError(error.response.data.error);
      setTimeout(() => {
        setRegisterError("");
      }, 5000);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log("Login hander called");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        {
          email: loginEmail,
          password: loginPassword,
        },
        config
      );

      // localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/");
    } catch (error) {
      setLoginError(error.response.data.error);
      setTimeout(() => {
        setLoginError("");
      }, 5000);
    }
  };

  // Overlay Animation
  const registerAni = () => {
    setActive(true);
  };
  const loginAni = () => {
    setActive(false);
  };
  return (
    <>
      <div className="main">
        {registerError && <h4 className="error-message">{registerError}</h4>}
        {loginError && <h4 className="error-message">{loginError}</h4>}
        <div
          className={isActive ? "container right-pannel-active" : "container"}
        >
          <div className="form-container register-container">
            <form onSubmit={registerHandler}>
              <h1>Create Account</h1>
              <div className="social-container">
                <GoMarkGithub className="social github" />
                <FaFacebook className="social facebook" />
                <FcGoogle className="social" />
              </div>
              <span>or use your email for registration</span>
              <input
                type="text"
                required
                placeholder="Name"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Confirm Password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          </div>
          <div className="form-container login-container">
            <form onSubmit={loginHandler}>
              <h1>Login</h1>
              <div className="social-container">
                <GoMarkGithub className="social github" />
                <FaFacebook className="social facebook" />
                <FcGoogle className="social" />
              </div>
              <span>or use your account</span>
              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <Link to="/forgotPassword">Forgot your password?</Link>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>Please login with your personal info</p>
                <button onClick={loginAni} className="ghost-btn login">
                  Login
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>CREATE ACCOUNT</h1>
                <p>Be the part of our community, join us today</p>
                <button onClick={registerAni} className="ghost-btn register">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterScreen;
