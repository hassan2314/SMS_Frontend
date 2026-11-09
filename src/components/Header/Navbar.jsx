import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import axios from "../../utils/axiosInstance";
import { routeForRole } from "../../utils/authUser";
import Logo from "../Logo";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth || {});

  const handleLogout = async () => {
    try {
      await axios.post("/users/logout");
    } catch {
      // Clear the local session even if the token is already expired.
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box
          component={Link}
          to={status ? routeForRole(user?.role) : "/login"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            textDecoration: "none",
            color: "inherit",
            minWidth: 0,
          }}
        >
          <Logo width="32" />
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            School Management
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {status ? (
            <>
              <Typography variant="body2" noWrap>
                {user?.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
