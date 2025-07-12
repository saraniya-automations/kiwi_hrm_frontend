import React, { useState } from "react";
import { Box, Grid, TextField, Button, MenuItem } from "@mui/material";
import { MONTHS } from "./../../utils/constants";

export default function SalaryFilter({ onSearch, itIsMy }) {

  const initialSalaryState = {
    id: itIsMy ? "no" : "",
    year: new Date().getFullYear(),
    month: new Date().toLocaleString("default", { month: "2-digit" }),
  };
  
  const [filters, setFilters] = useState(initialSalaryState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const handleClear = () => {
    setFilters(initialSalaryState);
    if (onSearch) onSearch(initialSalaryState);
  };

  return (
    <Box mb={3}>
      <Grid container spacing={2} alignItems="center">
        {!itIsMy && (
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="id"
              value={filters.id}
              onChange={handleChange}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Year"
            name="year"
            type="number"
            fullWidth
            required
            value={filters.year}
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
            value={filters.month}
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
          <Box display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={handleSearch} disabled={!(Object.values(filters).every(value => String(value)?.trim() !== ""))}>
              Search
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
