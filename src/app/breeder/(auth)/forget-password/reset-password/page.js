"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import BASE_URL from '../../../../utils/constant';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import Image from "next/image";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);
  
  const router = useRouter();
  const email = Cookies.get('email');

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(passwordRegex.test(value));
    setDoPasswordsMatch(value === cPassword);
  };

  const handleCPasswordChange = (e) => {
    const value = e.target.value;
    setCPassword(value);
    setDoPasswordsMatch(value === password);
  };


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password format
    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters.");
      return;
    }

    // Check if passwords match
    if (password !== cPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    if (email) {
      formData.append("email", email);
    } else {
      toast.error("Email cookie expired.");
      console.error("Error: Email cookie is missing or expired.");
      return;
    }

    formData.append("password", password);
    formData.append("conform_password", cPassword);

    try {
      await axios.post(`${BASE_URL}/api/password_create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Password successfully updated!");
      router.push('/breeder/sign-in');
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Error updating password. Please try again.");
    }
  };

  return (
    <main>
      <div className="breeder-signinflow-wrap">
        <div className="breeder-signinflow-inner">
          <div className="breeder-signin-leftsec">
            <Image 
              src="/images/Nextpet-imgs/big-logo.svg" 
              alt="Logo" 
              loading="lazy" 
              width={270} 
              height={306} 
            />
          </div>
          <div className="breeder-signin-rightsec">
            <form onSubmit={handleSubmit}>
              <h1>Reset Password</h1>

              <label className="login-lbl">
                <Image 
                  src="/images/Nextpet-imgs/breeder-signin-imgs/pass-icon.svg" 
                  alt="Password Icon" 
                  className="login-lbl-img" 
                  width={20} 
                  height={20} 
                />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="login-txt" 
                  placeholder="New Password" 
                  value={password} 
                  onChange={(e) => handlePasswordChange(e)} 
                  required 
                />
                {password && (
                  <Image
                    src={isPasswordValid 
                      ? "/images/Nextpet-imgs/breeder-signin-imgs/password-check-icon.svg"
                      : "/images/Nextpet-imgs/breeder-signin-imgs/password-cross-icon.svg"}
                    alt="Validation Icon"
                    width={40}
                    height={40}
                    style={{ position: 'absolute', zIndex: 200, right: '27px',height: '20px', top: '14px' }}
                  />
                )}
                <Image 
                  src={showPassword 
                    ? "/images/Nextpet-imgs/breeder-signin-imgs/eye-open.svg" 
                    : "/images/Nextpet-imgs/breeder-signin-imgs/eye-close.svg"} 
                  alt="Toggle Password Visibility" 
                  width={20} 
                  height={20} 
                  style={{ position: 'absolute', zIndex: 200, right: '14px', top: '14px', cursor: 'pointer' }} 
                  onClick={() => setShowPassword(!showPassword)} 
                />
              </label>

              <label className="login-lbl">
                <Image 
                  src="/images/Nextpet-imgs/breeder-signin-imgs/pass-icon.svg" 
                  alt="Confirm Password Icon" 
                  className="login-lbl-img" 
                  width={20} 
                  height={20} 
                />
                <input 
                  type={showPassword2 ? "text" : "password"} 
                  className="login-txt" 
                  placeholder="Confirm New Password" 
                  value={cPassword} 
                  onChange={(e) => handleCPasswordChange(e)} 
                  required 
                />

                {cPassword && (
                  <Image
                    src={doPasswordsMatch 
                      ? "/images/Nextpet-imgs/breeder-signin-imgs/password-check-icon.svg"
                      : "/images/Nextpet-imgs/breeder-signin-imgs/password-cross-icon.svg"}
                    alt="Validation Icon"
                    width={40}
                    height={40}
                    style={{ position: 'absolute', zIndex: 200, right: '27px',height: '20px', top: '14px' }}
                  />
                )}

                <Image 
                  src={showPassword2 
                    ? "/images/Nextpet-imgs/breeder-signin-imgs/eye-open.svg" 
                    : "/images/Nextpet-imgs/breeder-signin-imgs/eye-close.svg"} 
                  alt="Toggle Confirm Password Visibility" 
                  width={20} 
                  height={20} 
                  style={{ position: 'absolute', zIndex: 200, right: '14px', top: '14px', cursor: 'pointer' }} 
                  onClick={() => setShowPassword2(!showPassword2)} 
                />
              </label>

              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

              <input 
                type="submit" 
                className="login-btn" 
                value="Reset Password" 
              />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
