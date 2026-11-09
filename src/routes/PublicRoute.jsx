import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { routeForRole } from "../utils/authUser";

const PublicRoute = ({ children }) => {
  const { user, status } = useSelector((state) => state.auth);

  if (status && user) {
    return <Navigate to={routeForRole(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
