"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginBreeder } from "../../../services/loginService"; // Import the login service
import routes from "../../../../config/routes";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "@/src/app/utils/constant";
import { auth, provider, signInWithPopup } from "../../../../components/GoogleLogin";


const SignIn = () => {
  const { isBreederAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() =>{
    if(isBreederAuthenticated){
      toast.success('Breeder Login successfully')
      window.location.href = '/breeder/breeder-profile/dashboard-breeder-profile'
      
    }
  }, [isBreederAuthenticated])

  const handleBreederSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, uid } = user;
  
      const payload = {
        email,
        name: displayName,
        social_id: uid,
      };
      const response = await axios.post(`${BASE_URL}/api/SocialLogin`, payload);
  
      if (response.status === 200) {
        login({UniqueKey: response.data.data.user_id, type: 'breeder-admin-type'});
        localStorage.setItem("breeder_user_id", response.data.data.user_id);
  
      } else {
        toast.error("Login successful, but an error occurred on the server.");
        console.error("Backend Response Error:", response.data);
      }
    } catch (error) {
      console.error("Firebase Google Login Error or Backend Error:", error);
      toast.error("Failed to login with Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("emailOrPhone", email);
    formData.append("password", password);

    try {
      const response = await loginBreeder(formData);

      if (response.data.status_code !== 200) {
        setValidationError(response.data.message);
      } else {
        // console.log("response.data", response.data);
        login({UniqueKey: response.data.data.user_id, type: 'breeder-admin-type'});
        localStorage.setItem("breeder_user_id", response.data.data.user_id);
        // localStorage.setItem("name", response.data.data.name);
        // localStorage.setItem("email", response.data.data.email);
        // router.push("/");
        window.location.href = "/";
      }
    } catch (error) {
      setValidationError(error.message || "Please enter valid credentials.");
    }
  };

  return (
    <div className="breeder-signinflow-wrap">
      <div className="breeder-signinflow-inner">
        <div className="breeder-signin-leftsec">
          <Image
            src="/images/Nextpet-imgs/big-logo.svg"
            alt="Logo"
            width={270}
            height={306}
          />
        </div>
        <div className="breeder-signin-rightsec">
          <form onSubmit={handleSubmit}>
            <h1>Breeder Sign In</h1>
            <label htmlFor="email" className="login-lbl">
              <Image
                src="/images/Nextpet-imgs/breeder-signin-imgs/mail-icon.svg"
                alt="Mail Icon"  className="login-lbl-img"
                width={20}
                height={20}
              />
              <input
                type="email"
                id="email"
                name="name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-txt"
                placeholder="Email/Phone"
                required
              />
            </label>
            <label htmlFor="password" className="login-lbl">
              <Image
                src="/images/Nextpet-imgs/breeder-signin-imgs/pass-icon.svg"
                alt="Password Icon" className="login-lbl-img"
                width={20} 
                height={20}
              />
              <input
                type={showPassword ? "text": "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="login-txt"
                placeholder="Password"
                required
              />
              <Image src={showPassword ? "/images/Nextpet-imgs/breeder-signin-imgs/eye-open.svg" : "/images/Nextpet-imgs/breeder-signin-imgs/eye-close.svg"} alt="Password" width={20} height={20} style={{ position: 'absolute', zIndex: 200, right: '10px', width: '50px',height: '14px', top: '17px', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}/>
            </label>
            {validationError && (
              <p className="error-message">{validationError}</p>
            )}
            <div className="rembr-me">
              <Link href={routes.breeder_forget_password}>
                Forgot Password?
              </Link>
            </div>
            <input type="submit" className="login-btn" value="Sign In" />
            <div className="or-sec-wrap">
              <h3>Or Sign In using</h3>
            </div>
            <div className="social-login-wrap">
              <a href="#">
                <Image
                  src="/images/Nextpet-imgs/breeder-signin-imgs/socail1.png"
                  alt="Social 1"
                  width={40}
                  height={40} style={{cursor:'pointer'}} onClick={handleBreederSignIn}
                />
              </a>
              <a href="#">
                <Image
                  src="/images/Nextpet-imgs/breeder-signin-imgs/social2.png"
                  alt="Social 2"
                  width={40}
                  height={40}
                />
              </a>
              {/* <a href="#">
                <Image
                  src="/images/Nextpet-imgs/breeder-signin-imgs/social3.png"
                  alt="Social 3"
                  width={40}
                  height={40}
                />
              </a> */}
            </div>
            <div className="dont-have-accountwrap">
              <p>
                Don’t have an account?
                <Link href={routes.breeder_sign_up}>Sign Up</Link>
              </p>
              <p>
                Not a Breeder? <Link href="/user/sign-in">Sign In</Link> as a User?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
