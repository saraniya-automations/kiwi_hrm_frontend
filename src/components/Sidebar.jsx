import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Home,
  Groups,
  AssignmentInd,
  EventAvailable,
  EventBusy,
  ModelTraining,
  RequestQuote,
  PersonPin,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const drawerWidth = 240;

const allNavItems = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: <Home /> },
    { label: "Admin", path: "/admin/user", icon: <AssignmentInd /> },
    { label: "PIM", path: "/admin/pim", icon: <Groups /> },
    {
      label: "Attendance",
      path: "/admin/attendance",
      icon: <EventAvailable />,
    },
    {
      label: "Performance",
      path: "/admin/performance",
      icon: <ModelTraining />,
    },
    { label: "Salary", path: "/admin/salary", icon: <RequestQuote /> },
    { label: "Leaves", path: "/admin/leave", icon: <EventBusy /> },
  ],
  employee: [
    { label: "Dashboard", path: "/employee", icon: <Home /> },
    {
      label: "Attendance",
      path: "/employee/attendance",
      icon: <EventAvailable />,
    },
    {
      label: "Performance",
      path: "/employee/performance",
      icon: <ModelTraining />,
    },
    { label: "Salary", path: "/employee/salary", icon: <RequestQuote /> },
    { label: "Leaves", path: "/employee/leave", icon: <EventBusy /> },
  ],
};

export default function Sidebar() {
  const location = useLocation();
  const role =
    useAuthStore((state) => state.user?.role)?.toLowerCase() || "employee"; // Default to employee if no role found
  const navItems = allNavItems[role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
