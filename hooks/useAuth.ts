"use client"
import { ChangePasswordFormData } from "@/components/home/ChangPassModal";
import api from "@/lib/api";
import { AuthCredentials, ResetPasswordData } from "@/types";
import toast from "react-hot-toast";

const UseAuth = () => {
    const Login = async (AuthCredentials: AuthCredentials) => {
        try {
            const req = await api.post(`/auth/login`, AuthCredentials);
            return req.data;
        } catch (error) {
            console.error("Login error:", error);
        }
    }
    const ChangePassword = async (ChangePassData: ChangePasswordFormData) => {
        try {
            const req = await api.patch(`/auth/change-password`, ChangePassData);
            return req.data;
        } catch (error: any) {
            console.error("Login error:", error);
            // toast.error(error.response?.data?.message)
            throw error;
        }
    }
    const ForgotPassword = async (email: string) => {
        try {
            const req = await api.post(`/auth/forgot-password`, { email });
            return req.data;
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    }
    const ResetPassword = async (data: ResetPasswordData) => {
        try {
            const req = await api.patch(`/auth/reset-password`, data);
            return req.data;
        } catch (error: any) {
            console.error("Reset Password error:", error);
            throw error;
        }
    }
    return { Login, ChangePassword, ForgotPassword, ResetPassword }
}
export default UseAuth