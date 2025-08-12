import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(`admin/users/${id}`);
      setUser(userRes.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user.name}'s Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Basic Info</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography>Name: {user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Role: {user.role}</Typography>
        {user.dob && (
          <Typography>
            Date of Birth: {new Date(user.dob).toLocaleDateString()}
          </Typography>
        )}
        <Typography>
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      {user.role === "STUDENT" && user.student && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Student Info</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Class: {user.student.class?.name || "N/A"}</Typography>
          <Typography>
            Attendance Percentage: {user.student.attendancePercentage}%
          </Typography>

          {user.student.MonthlyResult?.length > 0 ? (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Monthly Results
              </Typography>
              <Divider sx={{ my: 1 }} />
              {user.student.MonthlyResult.map((result, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography>
                    {result.month} - {result.subject.name}
                  </Typography>
                  <Typography>
                    Marks: {result.marks}/{result.totalMarks}
                  </Typography>
                </Box>
              ))}
            </>
          ) : (
            <Typography>No Monthly Results Available</Typography>
          )}
        </Paper>
      )}

      {user.role === "TEACHER" && user.teacher && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Teacher Info</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>
            Subjects Teach:{" "}
            {user.teacher.subjects.map((s) => s.name).join(", ") || "N/A"}
          </Typography>
          <Typography>
            Assignments Pushed: {user.teacher.assignmentCount}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserProfile;
