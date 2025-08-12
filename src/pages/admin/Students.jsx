import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import axiosInstance from "../../utils/axiosInstance"; // your configured axios with interceptors

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/students", {
        params: {
          search,
          classId: filterClass,
          page,
          limit: 10,
        },
      });

      // students come from res.data.data
      const students = res?.data?.data ?? [];

      setStudents(Array.isArray(students) ? students : []);

      // if your backend doesn't send totalPages yet, set a default
      setTotalPages(res?.data?.totalPages ?? 1);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/classes");
      setClasses(res.data.data);
      //   console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axiosInstance.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignClass = async (studentId, classId) => {
    try {
      await axiosInstance.patch(`/students/${studentId}`, { classId });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewProfile = async (id) => {
    try {
      const [profileRes, attendanceRes] = await Promise.all([
        axiosInstance.get(`/students/${id}`),
        axiosInstance.get(`/attendances/${id}`), // example endpoint
      ]);

      setSelectedStudent({
        ...profileRes.data.data,
        attendance: attendanceRes.data.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [search, filterClass, page]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Manage Students
      </Typography>

      {/* Search and filter */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by name or email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Classes</MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Import CSV feature coming soon")}
        >
          Import CSV
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.user.name}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={student.classId || ""}
                      onChange={(e) =>
                        handleAssignClass(student.id, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewProfile(student.id)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No students found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box mt={2}>
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span style={{ margin: "0 8px" }}>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Box>

      {/* Profile Modal */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            width: 400,
            borderRadius: 2,
          }}
        >
          {selectedStudent ? (
            <>
              <Typography variant="h6" mb={2}>
                {selectedStudent.user?.name}
              </Typography>
              <Typography>Email: {selectedStudent.user?.email}</Typography>
              <Typography>
                Class: {selectedStudent.class?.name || "N/A"}
              </Typography>
              selectedStudent
              <Typography>
                Joined:{" "}
                {new Date(selectedStudent.user?.createdAt).toLocaleDateString()}
              </Typography>
              {/* Attendance Summary */}
              {selectedStudent.attendance && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Attendance Summary
                  </Typography>
                  <Typography>
                    Present: {selectedStudent.attendance.present} /{" "}
                    {selectedStudent.attendance.total} (
                    {selectedStudent.attendance.percentage}%)
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
