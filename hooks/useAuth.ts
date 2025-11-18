"use client"
import api from "@/lib/api";
import { ChangePasswordFormData } from "@/pages/change-password-page";
import { AuthCredentials } from "@/types";

const UseAuth = () => {
    const Login= async(AuthCredentials:AuthCredentials) => {
        try {
            const req = await api.post(`/auth/login`, AuthCredentials);
            return req.data; 
        } catch (error) {
            console.error("Login error:", error);
        }
    }
    const ChangePassword= async(ChangePassData:ChangePasswordFormData) => {
        try {
            const req = await api.patch(`/auth/change-password`, ChangePassData);
            return req.data; 
        } catch (error) {
            console.error("Login error:", error);
        }
    }
return {Login , ChangePassword}
}
export default UseAuth