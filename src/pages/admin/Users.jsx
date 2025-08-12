import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../utils/axiosInstance";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceError, setAttendanceError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleViewAttendance = async (user) => {
    try {
      setAttendanceError("");
      setAttendanceData(null);
      setSelectedStudent(user);
      setAttendanceDialogOpen(true);

      const res = await axios.get(`/attendances/${user.id}`);
      setAttendanceData(res.data.data); // expecting { percentage: 80.5 }
    } catch (err) {
      setAttendanceError("Failed to fetch attendance");
    }
  };

  const filteredUsers = filterRole
    ? users.filter((u) => u.role === filterRole)
    : users;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Manage Users</Typography>

        <Button
          variant="contained"
          component={RouterLink}
          to="/admin/addUser"
          color="primary"
        >
          Add User
        </Button>
      </Box>

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Role</InputLabel>
        <Select
          value={filterRole}
          label="Filter by Role"
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="TEACHER">Teacher</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>
                      <Link
                        component={RouterLink}
                        to={`/admin/users/${user.id}`}
                      >
                        {user.name}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="STUDENT">Student</MenuItem>
                      <MenuItem value="TEACHER">Teacher</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    {user.role === "STUDENT" && (
                      <IconButton
                        color="primary"
                        onClick={() => handleViewAttendance(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
      >
        <DialogTitle>Attendance Details</DialogTitle>
        <DialogContent>
          {attendanceError ? (
            <Alert severity="error">{attendanceError}</Alert>
          ) : attendanceData ? (
            <DialogContentText>
              <strong>{selectedStudent?.name}'s Attendance:</strong>
              <br />
              {attendanceData.percentage}% present
            </DialogContentText>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
