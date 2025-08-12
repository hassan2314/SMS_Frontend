import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
  ListItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  School,
  Class,
  MenuBook,
  CalendarMonth,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { label: "Users", icon: <People />, path: "/admin/users" },
  { label: "Teachers", icon: <School />, path: "/admin/teachers" },
  { label: "Students", icon: <People />, path: "/admin/students" },
  { label: "Subjects", icon: <MenuBook />, path: "/admin/subjects" },
  { label: "Classes", icon: <Class />, path: "/admin/classes" },
  { label: "Attendance", icon: <CalendarMonth />, path: "/admin/attendance" },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px", // Push below AppBar
          },
        }}
        PaperProps={{
          sx: {
            top: "64px", // Align with AppBar height
          },
        }}
      >
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.label}
                disablePadding
                component={NavLink}
                to={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton selected={isActive}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,

          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
