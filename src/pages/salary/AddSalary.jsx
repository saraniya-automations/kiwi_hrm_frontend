import React, { useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { MONTHS } from "../../utils/constants";
import { SALARY_CURRENCIES, SALARY_FREQUENCIES } from "../../utils/constants";
import Notification from "../../components/Notification";
import api from "../../services/api";

const initialState = {
  employee_id: "",
  month: new Date().toLocaleString("default", { month: "2-digit" }),
  year: new Date().getFullYear(),
  basic_salary: 0,
  bonus: 0,
  deductions: 0,
  currency: "NZD",
  pay_frequency: "Monthly",
  direct_deposit_amount: 0,
};

export default function AddSalary({onSubmit}) {
  const [form, setForm] = useState(initialState);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.month || !form.year) {
      setNotif({
        open: true,
        severity: "error",
        message: "Please fill all required fields",
      });
      return;
    }
    // Validate form data
    const payload = {
      employee_id: form.employee_id,
      salary_month: `${form.year}-${form.month}`,
      basic_salary: parseFloat(form.basic_salary || 0),
      bonus: parseFloat(form.bonus || 0),
      deductions: parseFloat(form.deductions || 0),
      direct_deposit_amount: parseFloat(form.direct_deposit_amount || 0),
      currency: form.currency,
      pay_frequency: form.pay_frequency,
    };
    // Call API to add salary record
    try {
      await api.addSalary(payload);
      setNotif({
        open: true,
        severity: "success",
        message: "Salary record added successfully",
      });
      setForm(initialState); // Reset form
      onSubmit?.(); // Call onSubmit callback if provided
    } catch (error) {
      setNotif({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "Failed to add salary record",
      });
    }
  };

  const handleCancel = () => {
    // Navigate back or reset form
    setForm(initialState);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6">Add Salary Record</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Employee ID"
              name="employee_id"
              fullWidth
              required
              value={form.employee_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Year"
              name="year"
              type="number"
              fullWidth
              required
              value={form.year}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              select
              label="Month"
              name="month"
              fullWidth
              required
              value={form.month}
              onChange={handleChange}
            >
              {MONTHS.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Basic Salary"
              name="basic_salary"
              type="number"
              fullWidth
              value={form.basic_salary}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Bonus"
              name="bonus"
              type="number"
              fullWidth
              value={form.bonus}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Deductions"
              name="deductions"
              type="number"
              fullWidth
              value={form.deductions}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="One Payment Amount"
              name="direct_deposit_amount"
              type="number"
              fullWidth
              value={form.direct_deposit_amount}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              select
              label="Currency"
              name="currency"
              fullWidth
              required
              value={form.currency}
              onChange={handleChange}
            >
              {SALARY_CURRENCIES.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              select
              label="Pay Frequency"
              name="pay_frequency"
              fullWidth
              required
              value={form.pay_frequency}
              onChange={handleChange}
            >
              {SALARY_FREQUENCIES.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="contained">
              Add
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Paper>
  );
}
