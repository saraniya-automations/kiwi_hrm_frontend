import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";

const tabs = [
  { label: "Personal", path: "personal" },
  { label: "Contact", path: "contact" },
  { label: "Job", path: "job" },
  { label: "Emergency", path: "emergency" },
  { label: "Dependents", path: "dependents" },
];

export default function EmployeeTabs({ children }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = tabs.findIndex(tab => location.pathname.includes(tab.path));

  const handleTabChange = (event, newValue) => {
    navigate(`/pim/edit/${id}/${tabs[newValue].path}`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {tabs.map(tab => (
          <Tab key={tab.path} label={tab.label} />
        ))}
      </Tabs>

      <Box><Outlet/></Box>
    </Paper>
  );
}
