import React from "react";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";

const LeaveBalanceCard = ({ balances }) => {
  const leaveTypes = Object.entries(balances).filter(
    ([key]) => key !== "employee_id"
  );

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, marginBottom: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TimeToLeaveIcon color="primary" />
          <Typography variant="h6">My Leave Balances</Typography>
        </Box>

        <Grid container spacing={2}>
          {leaveTypes.map(([type, value]) => (
            <Grid size={{xs: 12, sm: 6, md: 3}} key={type}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Leave
                </Typography>
                <Typography variant="h6">{value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
