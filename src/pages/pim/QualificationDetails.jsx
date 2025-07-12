import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import Notification from "../../components/Notification";

const QualificationDetails = () => {
  const { id } = useParams();
  const [qualifications, setQualifications] = useState([]);
  const [form, setForm] = useState({ degree: "", institution: "", year: "" });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleOpen = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      setForm(qualifications[index]);
    } else {
      setForm({ degree: "", institution: "", year: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ degree: "", institution: "", year: "" });
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.degree || !form.institution || !form.year) return;

    const updatedList = [...qualifications];
    if (editIndex !== null) {
      updatedList[editIndex] = form;
    } else {
      updatedList.push(form);
    }

    setQualifications(updatedList);
    callAPI(updatedList)
  };

  const handleDelete = (index) => {
    if (window.confirm(`Are you sure you want to delete this Qualification?`)) {
    const updated = qualifications.filter((_, i) => i !== index);
    setQualifications(updated);
    callAPI(updated)
    }
  };

  const callAPI = async(updatedList) => {
    try {
        const data = await api.updateEmployee(id, { qualifications: updatedList });
        setNotif({
          open: true,
          message: data.message || "Successfuly Updated Profile",
          severity: "success",
        });
      } catch (err) {
        setNotif({
          open: true,
          message: err.message || "Failed to Updated Profile",
          severity: "error",
        });
      } finally {
        handleClose();
      }
  }

  const fetchEmployee = async () => {
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.qualifications ? JSON.parse(data.qualifications) : [];

      setQualifications(parsed);
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setNotif({
        open: true,
        message: err.message || "Failed to Fetch Profile",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Degree</TableCell>
            <TableCell>Institution</TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualifications.map((q, i) => (
            <TableRow key={i}>
              <TableCell>{q.degree}</TableCell>
              <TableCell>{q.institution}</TableCell>
              <TableCell>{q.year}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(i)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(i)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {qualifications.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No qualifications added.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box mt={3}>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Qualification
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editIndex !== null ? "Edit" : "Add"} Qualification
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="degree"
            label="Degree"
            fullWidth
            value={form.degree}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="institution"
            label="Institution"
            fullWidth
            value={form.institution}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="year"
            label="Year"
            fullWidth
            value={form.year}
            onChange={handleChange}
            required
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </>
  );
};

export default QualificationDetails;
