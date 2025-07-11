import React from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SalaryCountdown from "../components/SalaryCoundown";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function EmployeeDashboard() {
  const eId = useAuthStore((state) => state.user?.employee_id) || "employee";
  const userInfo = useAuthStore((state) => state.user) || {};

  const navigate = useNavigate();
  const user = {
    name: userInfo?.name || "Employee",
    avatarUrl: "", // optional
    position: JSON.parse(userInfo.job_details)?.jobTitle || userInfo?.role || employee,
  };

  const leaveBalances = [
    { type: "Annual", total: 20, used: 5 },
    { type: "Sick", total: 10, used: 2 },
    { type: "Emergency", total: 5, used: 1 },
  ];

  const recentAttendance = [
    {
      date: "2025-06-24",
      status: "Present",
      timeIn: "09:00",
      timeOut: "17:00",
    },
    {
      date: "2025-06-23",
      status: "Present",
      timeIn: "09:15",
      timeOut: "17:05",
    },
    { date: "2025-06-22", status: "Absent", timeIn: "-", timeOut: "-" },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, display: "flex", alignItems: "center", gap: 2 }}
      >
        <Avatar
          src={userInfo?.personal_details ? JSON.parse(userInfo.personal_details)?.image : ""}
          alt={user.name}
          sx={{ width: 64, height: 64, cursor: "pointer"}}
          onClick={()=>navigate(`/employee/pim/edit/${eId}/personal`)}
        />
        <Box>
          <Typography variant="h6">Welcome back, {user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.position}
          </Typography>
        </Box>
      </Paper>

      {/* Leave Balances */}
      <Grid container spacing={3}>
        {leaveBalances.map((leave) => {
          const remaining = leave.total - leave.used;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={leave.type}>
              <Card sx={{ p: 2, borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TimeToLeaveIcon color="primary" />
                    <Typography variant="h6">{leave.type} Leave</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total: {leave.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used: {leave.used}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Remaining: {remaining}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Attendance & Actions */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Salary Countdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <SalaryCountdown />
        </Grid>

        {/* Attendance Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 2 ,  borderRadius: 3,}}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AccessTimeIcon color="secondary" />
              <Typography variant="h6">Recent Attendance</Typography>
            </Box>
            <List>
              {recentAttendance.map((entry, i) => (
                <React.Fragment key={i}>
                  <ListItem>
                    <ListItemText
                      primary={entry.date}
                      secondary={`Status: ${entry.status} | In: ${entry.timeIn} | Out: ${entry.timeOut}`}
                    />
                  </ListItem>
                  {i < recentAttendance.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 2,  borderRadius: 3}}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <EventAvailableIcon color="success" />
              <Typography variant="h6">Quick Actions</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={()=>navigate("/employee/leave")}
            >
              Apply for Leave
            </Button>
            <Button variant="outlined" color="secondary" fullWidth onClick={()=>navigate("/employee/performance")}>
              View My Performance
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
