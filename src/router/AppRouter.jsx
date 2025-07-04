import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import LoginLayout from "../layouts/LoginLayout";

// Pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import UserAdd from "../pages/admin/UserAdd";
import UserList from "../pages/admin/UserList";
import UserEdit from "../pages/admin/UserEdit";
import EmployeeList from "../pages/pim/EmployeeList";
import EmployeeTabs from "../pages/pim/EmployeeTabs";
import PersonalDetails from "../pages/pim/PersonalDetails";
import ContactDetails from "../pages/pim/ContactDetails";
import JobDetails from "../pages/pim/JobDetails";
import EmergencyDetails from "../pages/pim/EmergencyDetails";
import DependentDetails from "../pages/pim/DependentDetails";
import AttendanceList from "../pages/attendance/AttendanceList";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      // { index: true, element: <Home /> },

      // Admin routes (only for 'admin')
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: "admin",
            children: [
              { index: true, element: <UserList /> },
              { path: "add", element: <UserAdd /> },
              { path: "edit/:id", element: <UserEdit /> },
            ],
          },
          {
            path: "pim",
            children: [
              { index: true, element: <EmployeeList /> },
              {
                path: "edit/:id",
                element: <EmployeeTabs />,
                children: [
                  {
                    index: true,
                    path: "personal",
                    element: <PersonalDetails />,
                  },
                  {
                    path: "contact",
                    element: <ContactDetails />,
                  },
                  {
                    path: "job",
                    element: <JobDetails />,
                  },
                  {
                    path: "emergency",
                    element: <EmergencyDetails />,
                  },
                  {
                    path: "dependents",
                    element: <DependentDetails />,
                  },
                ],
              },
            ],
          },
          {
            path: "attendance",
            children: [
              { index: true, element: <AttendanceList /> },
              { path: "add", element: <UserAdd /> },
              { path: "edit/:id", element: <UserEdit /> },
            ],
          },
        ],
      },

      // PIM routes (admin + employee)
      {
        element: <ProtectedRoute allowedRoles={["employee"]} />,
        children: [
          { index: true, element: <Home /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
