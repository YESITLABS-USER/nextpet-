"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import OtpInput from 'react-otp-input';
import Cookies from 'js-cookie';
import BASE_URL from '../../../../utils/constant'
// import SignUpSuccessPopUp from '../../../../../components/ModelSignUpSuccess';
import { toast } from "react-toastify";
import axios from "axios";

const VerificationCode = () => {
  const router = useRouter();
  const savedOtp = Cookies.get('otp_email');
  // console.log(savedOtp);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp_error, setOtpError] = useState('');
  // const [showModal, setShowModal] = useState(false);
  const initialCountdown = 180; 
  const [countdown, setCountdown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const data = Cookies.get('email')
    setEmail(data)
  },[email])

  useEffect(() => {
    // Check if the otp_email cookie exists
    if (Cookies.get('otp_email')) {
      const savedStartTime = localStorage.getItem('verificationStartTime');
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

      if (savedStartTime) {
        const elapsedTime = currentTime - parseInt(savedStartTime, 10);
        const timeLeft = initialCountdown - elapsedTime;
        if (timeLeft > 0) {
          setCountdown(timeLeft);
        } else {
          setCountdown(0); // If time is up, set countdown to 0
          setIsExpired(true); // Mark as expired if time is zero
        }
      } else {
        // If there's no start time, set it now
        localStorage.setItem('verificationStartTime', currentTime);
        setCountdown(initialCountdown); // Start countdown from the initial value
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.removeItem('verificationStartTime'); // Clear saved start time
            setIsExpired(true); // Set expired flag
            return 0; // Stops at 0
          }
          return prev - 1; // Decrement the countdown
        });
      }, 1000);

      return () => {
        clearInterval(timer); // Cleanup on component unmount
      };
    } else {
      // If otp_email cookie is not present, set countdown and expired flag accordingly
      setCountdown(0);
      setIsExpired(false); // Ensure it is not marked as expired if no countdown starts
    }
  }, []);


  const handleResendOtp = () => {
    if(email){
      const response = axios.post(`${BASE_URL}/api/UserLogin_first`);
      if(response.code===200){
        toast.success("Otp Send Successfully");
        const expireDate = new Date(new Date().getTime() + 1800 * 1000);
        Cookies.set('otp_email', response.data.otp, { expires: expireDate });
      }
    } else{
      setError('Otp Send Error. Please try again later')
      console.log('Error in Sending OTP')
    }
  }
 
  // const formData = new FormData();
  // formData.append("email", Cookies.get('email'));
  // formData.append("otp", Cookies.get('otp_email'));

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(otp);

    if(savedOtp==null){
      setError("Your Otp Is Expire")
      toast.error("Your Otp Is Expire");
      setOtpError("Your Otp Is Expire");
    }
    else if(otp!==savedOtp){
      toast.error("Please Enter Correct Otp");
      setOtpError("Please Enter Correct Otp");
    }
    if(savedOtp!==null && otp==savedOtp){

      router.push('/breeder/forget-password/reset-password')

    }
  };

  return (
    <div className="breeder-signinflow-wrap">
      <div className="breeder-signinflow-inner">
        <div className="breeder-signin-leftsec">
          <Image src="/images/Nextpet-imgs/big-logo.svg" alt="Logo" width={270}
            height={306} />
        </div>
        <div className="breeder-signin-rightsec">
          <form onSubmit={handleSubmit}>
            <h1> Verification Code</h1>
            <p>Enter the verification code sent to your registered email/phone</p>
            {/* Build Error */}
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            {/* Build Error */}
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
                    width: '50px',
                    height: '50px',
                    padding: '0',
                    borderRadius: '6px',
                    border: '2px solid #E69E01',
                    background: '#FFF',
                    color: '#E69E01',
                    fontSize: '16px',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                />
              )}
            />
            </div>
            <spam>{otp_error}</spam>
            <input type="submit" className="login-btn" value="Verify & Proceed"/>
            <div className="terms-condition-paragraph">
              {isExpired ? (
                <p className="pb-2">
                Didn&apos;t receive the verification code? <br />
                <span onClick={handleResendOtp} style={{ color: "#FFC21A", fontWeight: 600, cursor:'pointer' }}>RESEND</span>
              </p>
              ) : (
                <p> Resend OTP in <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</span> sec</p>
              )}

              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;


