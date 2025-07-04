import React from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import { LineChart, PieChart, BarChart, axisClasses } from "@mui/x-charts";

const lineData = [
  { month: "Jan", employees: 20 },
  { month: "Feb", employees: 28 },
  { month: "Mar", employees: 35 },
  { month: "Apr", employees: 40 },
  { month: "May", employees: 50 },
];

const pieData = [
  { label: "HR", value: 6 },
  { label: "Engineering", value: 18 },
  { label: "Sales", value: 8 },
  { label: "Design", value: 4 },
];

const barData = [
  { name: "Mon", present: 60, absent: 10 },
  { name: "Tue", present: 62, absent: 8 },
  { name: "Wed", present: 58, absent: 12 },
  { name: "Thu", present: 66, absent: 6 },
  { name: "Fri", present: 72, absent: 4 },
  { name: "Sat", present: 50, absent: 20 }, // Optional weekend data
  { name: "Sun", present: 55, absent: 15 }, // Optional weekend data
];

export default function Dashboard() {
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
                86
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Present Today</Typography>
              <Typography variant="h4" color="success.main">
                74
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Leaves</Typography>
              <Typography variant="h4" color="warning.main">
                12
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
                  data: lineData.map((d) => d.employees),
                  label: "Employees",
                  color: "#2e7d32",
                },
              ]}
              xAxis={[
                { scaleType: "point", data: lineData.map((d) => d.month) },
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
                  data: pieData,
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
              xAxis={[{ scaleType: "band", data: barData.map((d) => d.name) }]}
              series={[
                {
                  data: barData.map((d) => d.present),
                  label: "Present",
                  color: "#2e7d32",
                },
                {
                  data: barData.map((d) => d.absent),
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
