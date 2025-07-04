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
import { Home, Groups, AssignmentInd, EventAvailable } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const drawerWidth = 240;

const allNavItems = {
  admin: [
    { label: "Dashboard", path: "/", icon: <Home /> },
    { label: "Admin", path: "/admin", icon: <AssignmentInd /> },
    { label: "PIM", path: "/pim", icon: <Groups /> },
    { label: "Attendance", path: "/attendance", icon: <EventAvailable /> },
  ],
  employee: [
    { label: "Dashboard", path: "/", icon: <Home /> },
    { label: "PIM", path: "/pim", icon: <Groups /> },
  ],
};

export default function Sidebar() {
  const location = useLocation();
  console.log(
    "Current USER:",
    useAuthStore((state) => state.user)
  );
  const role =
    useAuthStore((state) => state.user?.role)?.toLowerCase() || "employee"; // Default to employee if no role found
  console.log("Current ROLE:", role);
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
