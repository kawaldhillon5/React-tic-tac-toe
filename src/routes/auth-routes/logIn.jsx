import { Form, Link, redirect, useActionData, useLoaderData, useLocation, useNavigate, useNavigation } from "react-router-dom";

import './auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from "react";
import { logIn } from "../../scripts/api";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiLabCoat } from "react-icons/gi";


export async function action({request, params}) {
    let error, data; 
    const formData = await request.formData();
    try {
        const resp = await logIn(formData.get("username"), formData.get("password"));
        if(resp.status){
          if(resp.status === 200){
              data =  resp.data;
          }
      }
    } catch (err){
        console.log(err);
        error =  err.response ? err.response.data : err.message
    }
    if(error || data){
      return {error, data};
    } 
    return redirect('/');
  }

export default function LogIn(){
    const {error, data} = useActionData()? useActionData(): {error: '', data: ''};
    const location = useLocation();
    const [isFocused, setIsFocused] = useState({ username: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const navigate = useNavigate();
    const previousLocation = useRef(location.state?.from || '/');
    const logInSucess = function(){
      if(data){
          setTimeout(()=>{
              navigate((previousLocation.current === '/authenticate/logIn') ? '/': previousLocation.current);
          },1000)
      }
    }
    logInSucess();
    return (
        <div className="login-page">
        <div className="login-container">
          <div className="login-form-container">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Log in to continue</p>
            <Form method="post" id="log_in_form">
              <div className={`input-wrapper ${isFocused.username ? 'focused' : ''}`}>
                <label htmlFor="username">
                  <FontAwesomeIcon icon={faUser} />
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  required
                  onFocus={() => setIsFocused({ ...isFocused, username: true })}
                  onBlur={() => setIsFocused({ ...isFocused, username: false })}
                />
              </div>
              <div className={`input-wrapper password-container ${isFocused.password ? 'focused' : ''}`}>
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} />
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  required
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button type="submit" className="login-button login_button_enabled">
                {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : data ? <FaCheck /> : "Log In"}
              </button>
              {error && <div className="error-message">{error}</div>}
              <div className="sign-up-option">
                Don't have an account? <Link to="../authenticate/signUp">Sign Up</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
}