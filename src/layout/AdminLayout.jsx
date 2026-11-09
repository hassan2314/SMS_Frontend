import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  People,
  Groups,
  School,
  Class,
  MenuBook,
  CalendarMonth,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { label: "Users", icon: <People />, path: "/admin/users" },
  { label: "Teachers", icon: <School />, path: "/admin/teachers" },
  { label: "Students", icon: <Groups />, path: "/admin/students" },
  { label: "Subjects", icon: <MenuBook />, path: "/admin/subjects" },
  { label: "Classes", icon: <Class />, path: "/admin/classes" },
  { label: "Attendance", icon: <CalendarMonth />, path: "/admin/attendance" },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {isMobile && (
        <IconButton
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          sx={{ position: "fixed", top: 72, left: 8, zIndex: (t) => t.zIndex.drawer + 1, bgcolor: "background.paper" }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 0 : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: isMobile ? 0 : 64,
            height: isMobile ? "100%" : "calc(100% - 64px)",
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
                onClick={() => setMobileOpen(false)}
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          pl: { xs: 7, md: 3 },
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
