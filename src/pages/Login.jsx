import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axios from "../utils/axiosInstance";
import Logo from "../components/Logo";

const Login = () => {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setError("");
      const res = await axios.post("/users/login", data);
      const { accessToken, user } = res.data.data;

      dispatch(login({ accessToken, user }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Stack spacing={2} alignItems="center">
            <Logo width="80" />
            <Typography variant="h5" fontWeight="bold">
              Login to your account
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Stack spacing={2}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
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

                <Button variant="contained" type="submit" fullWidth>
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
