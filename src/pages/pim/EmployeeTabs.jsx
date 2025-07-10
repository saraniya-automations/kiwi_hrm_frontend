import React from "react";
import { Box, Tabs, Tab, Paper, Container } from "@mui/material";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const tabs = [
  { label: "Personal", path: "personal" },
  { label: "Contact", path: "contact" },
  { label: "Job", path: "job" },
  { label: "Emergency", path: "emergency" },
  { label: "Dependents", path: "dependents" },
];

export default function EmployeeTabs({ children }) {
  const eRole =
    useAuthStore((state) => state.user?.role)?.toLowerCase() || "employee";
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = tabs.findIndex((tab) =>
    location.pathname.includes(tab.path)
  );

  const handleTabChange = (event, newValue) => {
    navigate(`/${eRole}/pim/edit/${id}/${tabs[newValue].path}`);
  };

  return (
    <Paper
      sx={{
        p: 0,
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tabs header */}
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: 3, py: 2, flexGrow: 1, overflowY: "auto" }}>
        <Outlet />
      </Box>
    </Paper>
  );
}
