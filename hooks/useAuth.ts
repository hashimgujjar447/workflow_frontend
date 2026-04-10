import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useAuth = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  return {
    isAuthenticated: !!token && !!user, // ✅ FIXED
  };
};