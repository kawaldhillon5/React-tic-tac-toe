import { Form, Link, redirect, useActionData, useNavigate, useNavigation, useOutletContext, useSubmit } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import more icons
import {  useEffect, useState } from "react";
import { postSignUpData } from "../../scripts/api";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";

export async function action({request,params}) {
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData.entries());
    formObject.dateCreated = new Date();
    let error, data; 
    try{
        const resp  = await postSignUpData(formObject);
        if(resp.status){
            if(resp.status === 200){
                data =  resp.data;
            }
        }
    } catch(err){
        console.log(err);
        error =  err.response ? err.response.data : err.message;
    }finally{
        if(error || data){
            return {error, data};
        } else {
            return redirect('/');
        }
    }
}

export default function SignUp(){

    const [passwordError, setPasswordError] = useState(null);
    const [isFocused, setIsFocused] = useState({
        username: false,
        password: false,
        confirmPassword: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const navigate = useNavigate();
    const user = useOutletContext();
    const {error, data} = useActionData()? useActionData() : {error: '', data: ''};

    const validatePassword = (password) => {
        if (password.length < 8) {
        return "Password must be at least 8 characters long.";
        }
        if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
        }
        if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
        }
        if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return "Password must contain at least one special character.";
        }
        return null; // Password is valid
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const validationError = validatePassword(password);
        setPasswordError(validationError);
    };

    const checkPasswordFields = (e) =>{
        const password = e.target.value;
        const pass1 = document.querySelector('#password1').value;
        let error = null;
        if (password != pass1) {
            error = "Password Fields does not match";
        }
        setPasswordError(error);
    }
    
    const signUpSucess = function(){
        if(data){
            setTimeout(()=>{
                navigate('../authenticate/logIn');
            },1000)
        }
    }
    signUpSucess();

        useEffect(()=>{
      if(user.userId){
        navigate('/')
      }
    },[user])


    return (
        <div className="login-page"> 
        <div className="login-container"> 
            <div className="login-form-container"> 
            <h2>Create Account</h2> 
            <Form method="post" id="signup_form" >
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
                <div className={`input-wrapper ${isFocused.password ? 'focused' : ''}`}>
                <label htmlFor="password1">
                    <FontAwesomeIcon icon={faLock} />
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password1"
                    id="password1"
                    placeholder="Password"
                    required
                    onChange={handlePasswordChange}
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
                <div className={`input-wrapper ${isFocused.confirmPassword ? 'focused' : ''}`}>
                <label htmlFor="password2">
                    <FontAwesomeIcon icon={faLock} />
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password2"
                    id="password2"
                    placeholder="Confirm Password"
                    required
                    onChange={checkPasswordFields}
                    onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordError && <div className="password-error">{passwordError}</div>}
                </div>
                <button type="submit" 
                        className={passwordError? "login_button_disabled login-button":"login_button_enabled login-button"} 
                        disabled={passwordError? true: false}
                >{isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : data ? <FaCheck /> : "Sign Up"}</button>
                {error && <div className="error-message">{error}</div>}
                <div className="sign-up-option">
                Already have an account? <Link to="/authenticate/login">Log In</Link> 
                </div>
            </Form>
            </div>
        </div>
    </div>
    )
}