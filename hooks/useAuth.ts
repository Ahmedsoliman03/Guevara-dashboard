"use client"
import { ChangePasswordFormData } from "@/components/home/ChangPassModal";
import api from "@/lib/api";
import { AuthCredentials } from "@/types";
import toast from "react-hot-toast";

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
        } catch (error:any) {
            console.error("Login error:", error);
                // toast.error(error.response?.data?.message)
                throw error;
        }
    }
return {Login , ChangePassword}
}
export default UseAuth