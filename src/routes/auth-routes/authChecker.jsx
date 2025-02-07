import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";

export default function AuthChecker(){
    const user = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
        !(user.userId) ? navigate('/authenticate/logIn', {state: {from:location.pathname}}): null;
    },[user, navigate]);

    return  user.userId ? <Outlet context={user}/>: null
}