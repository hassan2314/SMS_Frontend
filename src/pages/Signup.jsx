import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axios from "../utils/axiosInstance";
import Logo from "../components/Logo";
const roles = ["TEACHER", "STUDENT"];

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { control, handleSubmit } = useForm();

  const createUser = async (data) => {
    setError("");
    try {
      const res = await axios.post("/users/register", data);
      const { accessToken, user } = res.data.data;
      dispatch(login({ accessToken, user }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Stack spacing={2} alignItems="center">
          <Logo width="80" /> {/* your logo component */}
          <Typography variant="h5" fontWeight="bold">
            Sign up to create account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2" }}>
              Sign in
            </Link>
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit(createUser)} style={{ width: "100%" }}>
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField {...field} label="Name" fullWidth required />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    required
                  />
                )}
              />

              <Controller
                name="dob"
                control={control}
                rules={{ required: "Date of birth is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <TextField {...field} label="Role" select fullWidth required>
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Button variant="contained" type="submit" fullWidth>
                Sign Up
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Signup;
