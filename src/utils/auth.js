export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
};

export const setAuthData = (data) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data));
};

export const getUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};