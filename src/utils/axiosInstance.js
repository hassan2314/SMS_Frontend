import axios from "axios";
import store from "../store/store";
import { login, logout } from "../store/authSlice";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

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
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = response.data.data;

        store.dispatch(login({ accessToken, user }));

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
