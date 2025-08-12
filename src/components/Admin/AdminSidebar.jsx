import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin/users">
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/admin/students">
          <ListItemText primary="Students" />
        </ListItem>
        <ListItem button component={Link} to="/admin/teachers">
          <ListItemText primary="Teachers" />
        </ListItem>
        <ListItem button component={Link} to="/admin/subjects">
          <ListItemText primary="Subjects" />
        </ListItem>
        <ListItem button component={Link} to="/admin/attendance">
          <ListItemText primary="Attendance" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
