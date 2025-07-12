import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
} from "@mui/material";

export default function LeaveFilter({ onSearch }) {
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const handleClear = () => {
    const cleared = { name: "", startDate: "", endDate: "" };
    setFilters(cleared);
    if (onSearch) onSearch(cleared);
  };

  return (
    <Box mb={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Employee Name"
            name="name"
            value={filters.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={!Object.values(filters).every(value => String(value).trim() !== "")}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
