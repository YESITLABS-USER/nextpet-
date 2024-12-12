
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import OtpInput from "react-otp-input";
import Cookies from "js-cookie";
import { breederSignUp } from "../../../services/user/verificationService"; // Import service
// import { verifyOtp, breederSignUp } from "../../../services/user/verificationService"; // Import service
import SignUpSuccessPopUp from "../../../../components/ModelSignUpSuccess";

const VerificationCode = () => {
  const savedOtp = Cookies.get("otp_email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const initialCountdown = 180;
  const [countdown, setCountdown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const data = Cookies.get('email')
    setEmail(data)
  },[email])

  const handleResendOtp = async() => {
    if(email){
      const response = await axios.post(`${BASE_URL}/api/UserLogin_first`, {'email' : email});
      console.log(response.data)
      if(response.data.code===200){
        toast.success("Otp Send Successfully");
        const expireDate = new Date(new Date().getTime() + 1800 * 1000);
        Cookies.set('otp_email', response.data.otp, { expires: expireDate });
      }
    } else{
      setError('Otp Send Error. Please try again later')
      console.log('Error in Sending OTP')
    }
  }

  useEffect(() => {
    if (Cookies.get("otp_email")) {
      const savedStartTime = localStorage.getItem("verificationStartTime");
      const currentTime = Math.floor(Date.now() / 1000);

      if (savedStartTime) {
        const elapsedTime = currentTime - parseInt(savedStartTime, 10);
        const timeLeft = initialCountdown - elapsedTime;
        if (timeLeft > 0) {
          setCountdown(timeLeft);
        } else {
          setCountdown(0);
          setIsExpired(true);
        }
      } else {
        localStorage.setItem("verificationStartTime", currentTime);
        setCountdown(initialCountdown);
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.removeItem("verificationStartTime");
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(0);
      setIsExpired(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!savedOtp || otp !== savedOtp) {
      setOtpError("Please enter the correct OTP.");
      return;
    }

    const formDataUserSignUp = new FormData();
    formDataUserSignUp.append("email", Cookies.get("email"));
    formDataUserSignUp.append("name", Cookies.get("name"));
    formDataUserSignUp.append("password", Cookies.get("password"));
    formDataUserSignUp.append("fcm_token", "");
    formDataUserSignUp.append("device_type", "web");

    try {
      const response = await breederSignUp(formDataUserSignUp);

      if (response.data.code === 200) {
        // const expireDate = new Date(new Date().getTime() + 15000 * 1000);
        localStorage.setItem("user_user_id", response.data.user_id);

        //Write Here code to delete Breeder here
        setShowModal(true);
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } catch (error) {
      setError("Error during sign-up. Please try again.");
    }
  };

  return (
    <div className="breeder-signinflow-wrap">
      <div className="breeder-signinflow-inner">
        <div className="breeder-signin-leftsec">
          <Image src="/images/Nextpet-imgs/big-logo.svg" alt="Logo" width={150} height={150} />
        </div>
        <div className="breeder-signin-rightsec">
          <form onSubmit={handleSubmit}>
            <h1>U Verification Code</h1>
            <p>Enter the verification code sent to your registered email/phone</p>
            {error && <p>{error}</p>}
            {/* {success && <p>{success}</p>} */}

            <div className="otp-verification-input">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>&nbsp;</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "50px",
                      height: "50px",
                      padding: "0",
                      borderRadius: "6px",
                      border: "2px solid #E69E01",
                      background: "#FFF",
                      color: "#E69E01",
                      fontSize: "16px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  />
                )}
              />
            </div>
            <span>{otpError}</span>
            <input type="submit" className="login-btn" value="Verify & Proceed" />

            <div className="terms-condition-paragraph">
              {isExpired ? (
                <p>
                  Didn&apos;t receive the verification code? <span onClick={handleResendOtp} style={{ color: "#FFC21A", fontWeight: 600, cursor:'pointer' }}>RESEND</span>
                </p>
              ) : (
                <p>Resend OTP in <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</span> sec</p>
              )}
            </div>
          </form>
        </div>
      </div>

      {showModal && <SignUpSuccessPopUp redirectUrl="/user/dashboard-user-profile" />}
    </div>
  );
};

export default VerificationCode;
