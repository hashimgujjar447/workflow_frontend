import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/store/store";
export const useAuth=()=>{
    const token=useSelector((state:RootState)=>state.auth.token)
     return {
    isAuthenticated: !!token,
  };
}