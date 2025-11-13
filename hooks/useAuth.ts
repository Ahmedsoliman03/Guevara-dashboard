import api from "@/lib/api";
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
return {Login}
}
export default UseAuth