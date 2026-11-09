import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axios from "../utils/axiosInstance";
import { getErrorMessage, routeForRole, toPublicUser } from "../utils/authUser";
import Logo from "../components/Logo";

const Login = () => {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setError("");
      setSubmitting(true);
      const res = await axios.post("/users/login", data);
      const user = toPublicUser(res.data?.data?.user);
      const accessToken = res.data?.data?.accessToken;
      dispatch(login({ accessToken, user }));
      navigate(routeForRole(user?.role));
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign in"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "safe center",
        py: 4,
      }}
    >
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2} alignItems="center">
          <Logo width="72" />
          <Typography variant="h5" align="center">
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            School management console for staff and students.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New here?{" "}
            <Link to="/signup" style={{ color: "#1B4F72" }}>
              Create an account
            </Link>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Stack spacing={2}>
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
    </Box>
  );
};

export default Login;
