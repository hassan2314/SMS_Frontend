import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Divider,
} from "@mui/material";
import axios from "../../utils/axiosInstance";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [dropRequests, setDropRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, dropRes] = await Promise.all([
        axios.get("/teachers"),
        axios.get("/subjectDrops"),
      ]);
      setTeachers(teachersRes.data.data);
      setDropRequests(dropRes.data.data);
    } catch (err) {
      setError("Failed to load teacher data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teachers & Drop Requests
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Teacher Overview */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              All Teachers
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subjects</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{teacher.user.name}</TableCell>
                      <TableCell>{teacher.user.email}</TableCell>
                      <TableCell>
                        {teacher.subjects.map((subj) => (
                          <Typography key={subj.name}>
                            {subj.name} ({subj.class?.name})
                          </Typography>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Drop Requests */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Subject Drop Requests
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dropRequests.map((req, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{req.teacher.user.name}</TableCell>
                      <TableCell>{req.teacher.user.email}</TableCell>
                      <TableCell>{req.subject.name}</TableCell>
                      <TableCell>{req.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AdminTeachers;
