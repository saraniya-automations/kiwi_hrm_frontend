import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Avatar, Typography } from "@mui/material";

export default function LoginLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Avatar
          src="/kiwi-logo.svg"
          alt="logo"
          variant="square" // makes it rectangular
          sx={{
            width: 80,
            height: 80,
            mx: "auto", // centers horizontally (margin-inline: auto)
            borderRadius: 1, // less rounded corners (set to 0 for sharp edges)
            display: "block", // ensure centering works
          }}
        />
        <Typography variant="h5" align="center" gutterBottom>
          Welcome Back to KiWi HRM
        </Typography>
        <Outlet />
      </Container>
    </Box>
  );
}
