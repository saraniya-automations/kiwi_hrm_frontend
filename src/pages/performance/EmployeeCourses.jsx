import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
} from "@mui/material";
// import api from "../services/api"; // your centralized API service
import api from "./../../services/api";
import SubmitCourseModal from "./SubmitCourseModal";
import Notification from "./../../components/Notification";

export default function EmployeeCourses() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  async function fetchCourses() {
    const resMy = await api.getPerfSubMy();
    const res = await api.getPerfMyCourse();
    setCourses([res]);
    setSubmissions(resMy?.items);
    console.log(resMy, "res");
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (course, notes) => {
    try {
      const payload = {
        ...course,
        course_name: course?.mandatory_course,
        ...notes,
      };
      const res = await api.submitCourseComplete(payload); // Assuming you have an API service to handle leave requests
      setNotif({
        open: true,
        severity: "success",
        message: res?.message || "submitted successfully",
      });
      fetchCourses();
    } catch (error) {
      setNotif({
        open: true,
        severity: "error",
        message: error?.error || "Failed to submit retry",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{mb:3}}>My Performance</Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6">Mandatory Courses</Typography>
        <List>
          {courses?.length > 0 ? courses.map((course, i) => (
            <ListItem key={i}>
              <Box size={{ xs: 12 }}>
                <ListItemText
                  primary={course.mandatory_course}
                  secondary={`Department: ${course.department}`}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  onClick={() => setSelected(course)}
                >
                  Completed
                </Button>
              </Box>
            </ListItem>
          ))
          : <Typography color="success" marginTop={3}>No Mandatory Courses</Typography>}
        </List>
        <SubmitCourseModal
          open={!!selected}
          onClose={() => setSelected(null)}
          onSubmit={(reason) => handleSubmit(selected, reason)}
        />
        <Notification
          open={notif.open}
          onClose={() => setNotif({ ...notif, open: false })}
          severity={notif.severity}
          message={notif.message}
        />
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Completed courses</Typography>
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Completion Note</TableCell>
                <TableCell>Completed At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reviewed By</TableCell>
                <TableCell>Reviewed At</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Admin Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.course_name}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.completion_note}</TableCell>
                  <TableCell>{item.completed_at}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.reviewed_by}</TableCell>
                  <TableCell>{item.reviewed_at}</TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>{item.admin_comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
