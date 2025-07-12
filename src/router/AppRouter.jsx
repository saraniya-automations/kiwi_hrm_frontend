import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import LoginLayout from "../layouts/LoginLayout";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import DashboardAdmin from "../pages/DashboardAdmin";
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
import ApplyLeave from "../pages/leave/ApplyLeave";
import LeavesList from "../pages/leave/LeavesList";
import EmployeeCourses from "../pages/performance/EmployeeCourses";
import EmployeeSalaryList from "../pages/salary/EmployeeSalaryList";
import AddSalary from "../pages/salary/AddSalary";
import MyAttendanceList from "../pages/attendance/MyAttendanceList"
import MySalaryList from "../pages/salary/MySalaryList"
import AdminCourseApprovals from "../pages/performance/AdminCourseApprovals"
import MyLeavesList from "../pages/leave/MyLeavesList"
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import QualificationDetails from "../pages/pim/QualificationDetails"

const pim = {
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
    {
      path: "qualifications",
      element: <QualificationDetails />,
    },
  ],
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    children: [
      { index: true, path: "login", element: <Login /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "resetpassword", element: <ResetPassword /> },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { element: <ProtectedRoute allowedRoles={["admin", "employee"]} />,
      children: [{ index: true, element: <Dashboard />}]
    },
      // Admin routes (only for 'admin')
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { index: true, element: <DashboardAdmin /> },
          {
            path: "user",
            children: [
              { index: true, element: <UserList /> },
              { path: "add", element: <UserAdd /> },
              { path: "edit/:id", element: <UserEdit /> },
            ],
          },
          {
            path: "pim",
            children: [{ index: true, element: <EmployeeList /> }, pim],
          },
          {
            path: "attendance",
            children: [
              { index: true, element: <AttendanceList /> },
              { path: "add", element: <UserAdd /> },
              { path: "edit/:id", element: <UserEdit /> },
            ],
          },
          {
            path: "performance",
            children: [
              { index: true, element: <AdminCourseApprovals />},
              { path: "my", element: <EmployeeCourses /> },
            ],
            
          },
          {
            path: "salary",
            children: [
              { index: true, element: <EmployeeSalaryList /> }, // Default salary list
              { path: "add", element: <AddSalary /> }, // Placeholder for add/edit salary
            ],
          },
          {
            path: "leave",
            element: <LeavesList />,
          },
        ],
      },

      // All routes (admin + employee)
      {
        path: "employee",
        element: <ProtectedRoute allowedRoles={["admin", "employee"]} />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: "pim",
            children: [pim],
          },
          {
            path: "attendance",
            children: [
              { index: true, element: <MyAttendanceList /> }
            ],
          },
          {
            path: "salary",
            children: [
              { index: true, element: <MySalaryList /> }
            ],
          },
          {
            path: "performance",
            children: [
              { index: true, element: <EmployeeCourses /> }
            ],
          },
          {
            path: "leave",
            children: [
              { index: true, element: <MyLeavesList /> }
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
