import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function LoginLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} 
        sx={{
          p: 4,
          minWidth: { xs: "100%", sm: 400 },
          maxWidth: 420,
        }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}
