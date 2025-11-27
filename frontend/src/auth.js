

const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const NAME_KEY = "name";
const USERID_KEY = "userId";

export function saveAuth({ token, role, name, userId }) {
  localStorage.setItem(TOKEN_KEY, token);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (name) localStorage.setItem(NAME_KEY, name);
  if (userId) localStorage.setItem(USERID_KEY, String(userId));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserInfo() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    role: localStorage.getItem(ROLE_KEY),
    name: localStorage.getItem(NAME_KEY),
    userId: localStorage.getItem(USERID_KEY),
  };
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(USERID_KEY);
}
