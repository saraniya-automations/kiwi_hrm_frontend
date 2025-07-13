import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import { LineChart, PieChart, BarChart, axisClasses } from "@mui/x-charts";
import api from "../services/api";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({})
  const [weeklyAttendance, setWeeklyAttendance] = useState([])
  const [empGrowth, setEmpGrowth] = useState([])
  const [department, setDepartment] = useState([])

  const fetchData = async () => {
    try {
      const dataStats = await api.getDashboardStats();
      const dataWeekly = await api.getDashboardWeekly();
      const dataEmp = await api.getDashboardEmpGrowth();
      const dataDep= await api.getDashboardDepartment();
      setStats(dataStats)
      setWeeklyAttendance(dataWeekly)
      setEmpGrowth(dataEmp?.data)
      const depFormat = Object.entries(dataDep?.data).map(([key, value]) => ({
        label: key,
        value: value
      }));
      setDepartment(depFormat)
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4" color="primary">
                {stats.total_employees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Present Today</Typography>
              <Typography variant="h4" color="error.main">
                {stats.employees_on_leave}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Attendance</Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending_requests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Monthly Employee Growth
            </Typography>
            <LineChart
              height={250}
              series={[
                {
                  data: empGrowth.map((d) => d.employees),
                  label: "Employees",
                  color: "#2e7d32",
                },
              ]}
              xAxis={[
                { scaleType: "point", data: empGrowth.map((d) => d.month) },
              ]}
              sx={{ [`& .${axisClasses.root}`]: { stroke: "#666" } }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Department Breakdown
            </Typography>
            <PieChart
              series={[
                {
                  data: department,
                  innerRadius: 30,
                  outerRadius: 80,
                },
              ]}
              height={250}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Weekly Attendance
            </Typography>
            <BarChart
              height={300}
              xAxis={[{ scaleType: "band", data: weeklyAttendance?.map((d) => d.name) }]}
              series={[
                {
                  data: weeklyAttendance?.map((d) => d.present),
                  label: "Present",
                  color: "#2e7d32",
                },
                {
                  data: weeklyAttendance?.map((d) => d.absent),
                  label: "Absent",
                  color: "#ef5350",
                },
              ]}
              sx={{ [`& .${axisClasses.root}`] : { stroke: "#666" } }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
