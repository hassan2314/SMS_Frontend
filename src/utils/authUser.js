const PRIVATE_USER_FIELDS = new Set(["password", "refreshToken"]);

export function toPublicUser(user) {
  if (!user || typeof user !== "object") return null;
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !PRIVATE_USER_FIELDS.has(key))
  );
}

export function routeForRole(role) {
  if (role === "ADMIN") return "/admin/dashboard";
  return "/";
}

export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}
