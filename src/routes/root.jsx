import { FaGithub, FaExclamationTriangle, FaUserCircle, FaCheck} from 'react-icons/fa'
import '../css/root.css'
import { Form, Link, Outlet, useActionData, useLoaderData, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import api from '../scripts/axios-config';
import { useEffect, useRef, useState } from 'react';
import { LogOut } from '../scripts/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export async function action({request, params}) {
    let errorAction, data; 
    try{
        const resp  = await LogOut();
        if(resp.status){
            if(resp.status === 200){
                data =  resp.data;
            }
        }
    } catch(err){
        console.log(err);
        errorAction =  err.response ? err.response.data : err.message;
    }finally{
        if(errorAction || data){
            return {errorAction, data};
        } else {
            return redirect('/');
        }
    }
    
    
} 

export async function loader() {
    let error, user = {userId: null};
    try{
        const resp = await api.get('/authenticate/user');
        user = resp.data
    } catch(err){
        error = err.message
    }
    return {error, user}
}

export default function Root() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const { user, error } = useLoaderData();
    const [showDialog, setShowDialog] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const isSubmitting = navigation.state === "submitting";
    const {errorAction, data} = useActionData()? useActionData() : {errorAction: '', data: ''};

    
    function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDialog(false);
        }
    }
    
    const handleLogIn = () => {
        navigate('authenticate/logIn', {state: {from:location.pathname}});
    }

    const logOutSucess = function(){
        if(data){
            setTimeout(()=>{
                setShowDialog(false);
            },500)
        }
    }
    logOutSucess();
    useEffect(() => {
        document.querySelector('#root').addEventListener('mousedown', handleClickOutside);
        return () => {
          document.querySelector('#root').removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
      <> <div>
            {navigation.state === 'loading' && <div className="loading-bar"></div>}
        </div>
        <div id="root-header">
          <h2 onClick={() => navigate("/")}>Tic Tac Toe</h2>
  
          <div className="header-links">
            <Link to="/about">About</Link>
  
            <div className="user-section" ref={dropdownRef}>
              {user.userId ? (
                <button className="user-btn" onClick={() => setShowDialog((prev) => !prev)}>
                  <FaUserCircle size={20} /> {user.userName}
                </button>
              ) : error ? (
                <button className="warning-btn" onClick={() => setShowDialog((prev) => !prev)}>
                  <FaExclamationTriangle size={20} />
                </button>
              ) : (
                <button className="login-btn" onClick={() => handleLogIn()}>
                  Log In
                </button>
              )}
  
              {showDialog && (
                <div className="dropdown" >
                  {user.userId ? (
                    <>
                        <p>Welcome, {user.userName}!</p>
                        <Form method="post">
                            <button type="submit">{isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : data ? <FaCheck /> : "Log Out"}</button>
                        </Form>
                        {errorAction && <div className="error-message">{errorAction}</div>}
                    </>

                  ) : (
                    <p className="error-text">{error ? error : "Unknown error occurred."}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
  
        <div id="root-content">
          <Outlet context={user}/>
        </div>
  
        <div id="root-footer">
          <FaGithub />
          <a href="https://github.com/kawaldhillon5" target="_blank" rel="noopener noreferrer">
            Kawal Dhillon
          </a>
        </div>
      </>
    );
  }