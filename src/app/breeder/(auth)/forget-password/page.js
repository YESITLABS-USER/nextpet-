"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
// import OtpInput from 'react-otp-input';
import Cookies from 'js-cookie';
import routes from '../../../../config/routes';
import BASE_URL from '../../../utils/constant'

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if(email){
      setValidationError('');
    }
  },[email])

  const handleEmailVarification = async (e) => {
    e.preventDefault()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Strict email validation
    const phoneRegex = /^(?!\+1)[2-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{4}$/; // U.S. phone numbers without +1 prefix
    
    if (!(emailRegex.test(email) || phoneRegex.test(email))) {
      setValidationError("Invalid Email address or U.S. phone number. Ensure the phone number does not include '+1'.");
      return;
    } 
 
    const formData = new FormData();
    formData.append("email", email);

    try {
      // API call to register the user
      const response = await axios.post(`${BASE_URL}/api/send_forget_password`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data.code!==200){
        setValidationError(response.data.message);
      }
      else{
        const expireDate = new Date(new Date().getTime() + 1800 * 1000);
        Cookies.set('email', response.data.email, { expires: expireDate });
        // Cookies.set('otp_email',  response.data.otp, { expires: expireDate });
        // Cookies.set('otp_email', response.data.otp, { expires: expireDate });
        Cookies.set('otp_email', response.data.otp, { expires: expireDate });
        // console.log(response);
        router.push(routes.breeder_forget_password_varificatin_code);
      }
    }
    catch (error) {
      console.log(error);
      
    }
  }

  return (
    <>
      <>
      <div className="breeder-signinflow-wrap">
        <div className="breeder-signinflow-inner">
          <div className="breeder-signin-leftsec">
            <Image src="/images/Nextpet-imgs/big-logo.svg" alt="Logo" width={270}
            height={306}/>
          </div>
          <div className="breeder-signin-rightsec">
            <form method="POSt" onSubmit={handleEmailVarification}>
              <h1>Forgot Password</h1>
              <label for="" className="login-lbl">
                <Image src="/images/Nextpet-imgs/breeder-signin-imgs/mail-icon.svg" className="login-lbl-img" alt="" width={50} height={15}/>
                <input type="text" className="login-txt" onChange={(e) => setEmail(e.target.value)} placeholder="Email/Phone" required/>
              </label>
              <spam style={{color:'red'}}>{validationError}</spam>
              <input type="submit" className="login-btn" value="Send Verification"/>
            </form>
          </div>
        </div>
      </div>
      </>
    </>
  )
}

export default ForgetPassword