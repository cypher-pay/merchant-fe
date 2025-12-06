import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthRedirect() {
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        if(token){
            navigate("/dashboard");
        }
    },[]);
}