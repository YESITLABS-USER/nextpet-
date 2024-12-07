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
  const [error, setError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  const router = useRouter();
  const email = Cookies.get('email');

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setError("Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters.");
      return;
    }

    if (password !== cPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email) {
      console.error("Email cookie is missing or expired.");
      toast.error("Email cookie expired. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", cPassword);

    try {
      await axios.post(`${BASE_URL}/api/user_password_create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Password successfully updated!");
      router.push('/user/sign-in');
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

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

  return (
    <main>
      <div className="breeder-signinflow-wrap">
        <div className="breeder-signinflow-inner">
          <div className="breeder-signin-leftsec">
            <Image src="/images/Nextpet-imgs/big-logo.svg" alt="" loading="lazy" width={270} height={306} />
          </div>
          <div className="breeder-signin-rightsec">
            <form onSubmit={handleSubmit}>
              <h1>Reset Password</h1>

              <label className="login-lbl">
                <img src="/images/Nextpet-imgs/breeder-signin-imgs/pass-icon.svg" className="login-lbl-img" alt="Password Icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-txt"
                  placeholder="New Password"
                  value={password}
                  onChange={handlePasswordChange}
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
                  style={{ position: 'absolute', zIndex: 200, right: '15px',height: '14px', top: '17px', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </label>

              <label className="login-lbl">
                <img src="/images/Nextpet-imgs/breeder-signin-imgs/pass-icon.svg" className="login-lbl-img" alt="Password Icon" />
                <input
                  type={showPassword2 ? "text" : "password"}
                  className="login-txt"
                  placeholder="Confirm New Password"
                  value={cPassword}
                  onChange={handleCPasswordChange}
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
                  alt="Toggle Password Visibility"
                  width={20}
                  height={20}
                  style={{ position: 'absolute', zIndex: 200, right: '15px',height: '14px', top: '17px', cursor: 'pointer' }}
                  onClick={() => setShowPassword2(!showPassword2)}
                />
              </label>

              {error && <span className="error-msg" style={{ color: 'red' }}>{error}</span>}

              <input type="submit" className="login-btn" value="Reset Password" />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
