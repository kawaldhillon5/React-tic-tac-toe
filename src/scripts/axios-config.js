import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, 
  withCredentials: true,
  
});



api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error); 
  }
);

export default api