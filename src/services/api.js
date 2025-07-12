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
    console.error("API Error:", JSON.stringify(data));
    throw new Error(data?.error || "Something went wrong");
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

  getAllUsers: async (limit = 10, offset = 0) => {
    try {
      const res = await request(`/users?limit=${limit}&offset=${offset}`);
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update user");
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await request(`/users/${id}`, {
        method: "DELETE",
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to delete user");
    }
  },

  getEmployees: async (limit = 10, offset = 0, key = "") => {
    try {
      const res = await request(
        `/profiles?limit=${limit}&offset=${offset}&key=${key}`
      );
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
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update");
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

  getAttendanceByFilter: async (name = "", start_date = "", end_date = "") => {
    try {
      const res = await request(
        `/attendance/search?name=${name}&start_date=${start_date}&end_date=${end_date}`
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch records");
    }
  },

  getMyAttendanceByFilter: async (start_date = "", end_date = "") => {
    try {
      const res = await request(
        `/attendance/my-records?start_date=${start_date}&end_date=${end_date}`
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getPendingAttendance: async (page, perpage) => {
    try {
      const res = await request(`/attendance/requests?page=${page}&per_page=${perpage}`);
      return res;
    } catch (error) {
      throw new Error(
        error.message || "Failed to fetch pending records"
      );
    }
  },

  getAllMyAttendance: async (page, perpage) => {
    try {
      const res = await request(`/attendance/all-my-records?page=${page}&per_page=${perpage}`);
      return res;
    } catch (error) {
      throw new Error(
        error.message || "Failed to fetch records"
      );
    }
  },

  addManualAttendance: async (data) => {
    try {
      const res = await request(`/attendance/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to add");
    }
  },

  updateAttendanceStatusApprove: async (id) => {
    try {
      const res = await request(`/attendance/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update status");
    }
  },

  updateAttendanceStatusReject: async (id, rejection_reason) => {
    try {
      const res = await request(`/attendance/reject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejection_reason }),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update status");
    }
  },

  addSalary: async (data) => {
    try {
      const res = await request(`/salary/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to add");
    }
  },

  getAllSalary: async (page, per_page) => {
    try {
      const res = await request(
        `/salary/employee?page=${page}&per_page=${per_page}`
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  exportSalary: async (id, month) => {
    const token = getToken();
    try {
      const res = await fetch(
        `${BASE_URL}/salary/export-pdf?employee_id=${id}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to export");
    }
  },

  getSalaryByFilter: async (id = "", month = "") => {
    try {
      const res = await request(`/salary/employee/${id}?month=${month}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch records");
    }
  },

  downloadMySalary: async (month) => {
    const token = getToken();
    try {
      const res = await fetch(
        `${BASE_URL}/salary/my-records/payslip?month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to download");
    }
  },

  getMySalaryByFilter: async (month = "") => {
    try {
      const res = await request(`/salary/my-records?month=${month}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch records");
    }
  },

  applyLeave: async (data) => {
    try {
      const res = await request(`/leave/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error || "Failed to apply leave");
    }
  },

  getPendingLeave: async (page=1, per_page=10) => {
    try {
      const res = await request(`/leave/pending?page=${page}&per_page=${per_page}`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  updateLeaveStatus: async (id, status) => {
    try {
      const res = await request(`/leave/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update status");
    }
  },

  getLeaveByFilter: async (name, start_date, end_date) => {
    try {
      const res = await request(
        `/leave/search?name=${name}&start_date=${start_date}&end_date=${end_date}`
      );
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch leave");
    }
  },

  getDashboardStats: async () => {
    try {
      const res = await request(`/dashboard/stats`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getDashboardEmpGrowth: async () => {
    try {
      const res = await request(`/dashboard/employee-growth`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getDashboardDepartment: async () => {
    try {
      const res = await request(`/dashboard/department-counts`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getDashboardWeekly: async () => {
    try {
      const res = await request(`/attendance/weekly-chart`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getPerfMyCourse: async () => {
    try {
      const res = await request(`/performance/my-course`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getPerfSubPending: async () => {
    try {
      const res = await request(`/performance/submissions/pending`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getPerfSubAll: async () => {
    try {
      const res = await request(`/performance/submissions/all`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getPerfSubMy: async () => {
    try {
      const res = await request(`/performance/my-submissions`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  submitCourseComplete: async (data) => {
    try {
      const res = await request(`/performance/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error || "Failed to submit");
    }
  },

  updatePrefStatus: async (id, data) => {
    try {
      const res = await request(`/performance/submissions/${id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to update status");
    }
  },

  getMyLeave: async () => {
    try {
      const res = await request(`/leave/my`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getLeaveBalance: async () => {
    try {
      const res = await request(`/leave/balance`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getDashboadMy: async () => {
    try {
      const res = await request(`/employee/dashboard/summary`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  getDashboadSalaryCount: async () => {
    try {
      const res = await request(`/salary/countdown`);
      return res;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch");
    }
  },

  forgotPassword: async (data) => {
    try {
      const res = await request(`/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error || "Failed to submit");
    }
  },

  resetPassword: async (data) => {
    try {
      const res = await request(`/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      throw new Error(error || "Failed to submit");
    }
  }

};

export default api;
