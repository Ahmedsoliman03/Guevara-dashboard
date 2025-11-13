import { AuthCredentials } from "@/types";
import axios from "axios";

const UseAuth = () => {
    const Login= async(AuthCredentials:AuthCredentials) => {
        try {
            const req = await axios.post(`http://localhost:3000/auth/login`, AuthCredentials);
            return req.data; 
        } catch (error) {
            console.error("Login error:", error);
        }
    }
return {Login}
}
export default UseAuth