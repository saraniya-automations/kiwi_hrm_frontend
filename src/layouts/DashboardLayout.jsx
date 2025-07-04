import { Box, CssBaseline, Toolbar } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar / Header */}
      <Header />

      {/* Sidebar Drawer */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
        <Box sx={{ mt: 5, textAlign: "center", color: "gray", fontSize: 14 }}>
          &copy; 2025 KiWi HRM. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
}
