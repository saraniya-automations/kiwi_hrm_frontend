import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";


const user = {
  name: "SB",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
};

export default function Header() {
  const eId = useAuthStore((state) => state.user?.employee_id) || "employee";
  const userInfo = useAuthStore((state) => state?.user) || {};
  const eName = useAuthStore((state) => state.user?.name) || eId;


    const location = useLocation();
    const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  const handleSignOut = () => {
      handleMenuClose();
      // Add sign-out logic here
      useAuthStore.getState().logout();
      alert("Signed out");
      navigate("/login");
    };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer", display: "flex", justifyItems: "center", gap: 2 }} noWrap onClick={()=>navigate("/")}>
          <Avatar
                   src="/kiwi-logo.svg"
                   alt="logo"
                   variant="square" // makes it rectangular
                   sx={{
                     width: 30,
                     height: 30,
                     display: "flex", // ensure centering works
                   }}
                 /> KiWi HRM
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">{eName}</Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar src={userInfo?.personal_details ? JSON.parse(userInfo.personal_details)?.image : ""} />
            <ArrowDropDownIcon sx={{ color: "white" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>{eName}</MenuItem>
            <MenuItem onClick={()=>navigate(`/employee/pim/edit/${eId}/personal`)}>
              <ListItemIcon>
                <PersonPinIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
