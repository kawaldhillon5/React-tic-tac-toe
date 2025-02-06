import api from "./axios-config";

export async function logIn(username, password){
    return await api.post(`/authenticate/logIn`, 
        {username: username, password: password});
}

export async function LogOut(){
    return await api.post(`authenticate/logOut`);
}

export async function postSignUpData(data) {
    return await api.post(`authenticate/signUp`,{data : data});
}
