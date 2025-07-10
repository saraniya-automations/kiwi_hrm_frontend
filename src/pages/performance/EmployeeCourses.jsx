import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
// import api from "../services/api"; // your centralized API service

export default function EmployeeCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
    //   const res = await api.get("/performance/mandatory-courses");
    //   setCourses(res.data);
    }
    fetchCourses();
  }, []);

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6">Mandatory Courses</Typography>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id}>
            <ListItemText primary={course.title} secondary={`Department: ${course.department}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
