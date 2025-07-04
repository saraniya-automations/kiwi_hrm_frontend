import useAuthStore from "../store/authStore";
import { isTokenExpired } from "../utils/auth"; // Assuming you have a utility function to check token expiration

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => useAuthStore.getState().token;

async function request(path, options = {}) {
  const token = getToken();

  if (token && isTokenExpired(token)) {
    useAuthStore.getState().logout(); // clear token, redirect to login, etc.
    throw new Error("Session expired. Please login again.");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Something went wrong");
  }

  return res.json();
}

const api = {
  login: async (credentials) => {
    try {
      const res = await request(`/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to login");
    }
  },

  addUser: async (userData) => {
    try {
      const res = await request(`/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to add user");
    }
  },

  getAllUsers: async () => {
    try {
      const res = await request(`/users`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  getAllUsersByKey: async (key) => {
    try {
      const res = await request(`/users/search?name=${key}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user by Name");
    }
  },

  getUserById: async (id) => {
    try {
      const res = await request(`/users/${id}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user by ID");
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await request(`/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type":
            data instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update user");
    }
  },

  getEmployees: async (limit=10, offset=0, key='') => {
    try {
      const res = await request(`/profiles?limit=${limit}&offset=${offset}&key=${key}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch employees");
    }
  },

  getEmployeeById: async (id) => {
    try {
      const res = await request(`/profile/${id}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch employee by ID");
    }
  },

  updateEmployee: async (id, data) => {
    try { 
      const res = await request(`/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type":
            data instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
      return res
    } catch (error) {
      throw new Error(error.message || "Failed to update employee");
    }
  },

  deleteEmployee: async (id) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete employee");
    return res.json();
  },
};

export default api;
