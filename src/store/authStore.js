import { create } from "zustand";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const getStoredToken = () => localStorage.getItem("token") || null;

const useAuthStore = create((set) => ({
  user: getStoredToken() ? jwtDecode(getStoredToken())?.sub : '', // decode the token;
  token: getStoredToken(),

  login: async (credentials) => {
    try {
      const data = await api.login(credentials); // << API CALL HERE
      console.log("Login response:", data);
      if (!data || !data.access_token) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("token", data.access_token);
      if (data?.employee_id) {
        const userInfo = await api.getEmployeeById(data?.employee_id);
        set({ user: {...data, ...userInfo}, token: data.access_token });
      } else {
        set({ user: jwtDecode(data.access_token)?.sub, token: data.access_token });
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
    window.location.href = "/login"; // Redirect to login page
  },
}));

export default useAuthStore;
