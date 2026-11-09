import axios from "axios";
import store from "../store/store";
import { login, logout } from "../store/authSlice";
import { toPublicUser } from "./authUser";

const rawBase =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const baseURL = `${String(rawBase).replace(/\/+$/, "")}/`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const SKIP_REFRESH = ["/users/login", "/users/register", "/users/refresh-token"];

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config || {};
    const url = originalRequest.url || "";
    const skipRefresh = SKIP_REFRESH.some((path) => url.includes(path));

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const accessToken = response.data?.data?.accessToken;
        const user = toPublicUser(response.data?.data?.user);
        if (!accessToken) {
          throw new Error("Refresh did not return an access token");
        }

        store.dispatch(login({ accessToken, user }));
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
