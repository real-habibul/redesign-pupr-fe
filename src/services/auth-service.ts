export const login = async (username: string, password: string) => {
  const response = await fetch("https://api-ecatalogue-staging.online/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await response.json();
};

export const fetchRole = async (token: string) => {
  const response = await fetch("https://api-ecatalogue-staging.online/api/check-role", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const ssoLogin = async (token: string) => {
  const response = await fetch("https://bravo.pu.go.id/backend/ssoinformation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return await response.json();
};