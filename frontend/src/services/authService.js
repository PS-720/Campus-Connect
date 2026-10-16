import apiClient from "./apiClient";

const AUTH_KEY = "cc_user";
const TOKEN_KEY = "cc_token";

/**
 * Register a new user account.
 * @param {{ name, email, password, university?, department?, yearOfStudy? }} data
 */
export async function register(data) {
  const response = await apiClient.post("/auth/register", data);
  // response is already unwrapped: { success, message, data: AuthResponse }
  _persistSession(response);
  return response.data;
}

/**
 * Login with email and password.
 * @param {{ email, password }} credentials
 */
export async function login(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  _persistSession(response);
  return response.data;
}

/**
 * Logout the current user — clears local storage.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Fetch the currently authenticated user profile from the server.
 */
export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

/**
 * Get cached user from localStorage (no network call).
 */
export function getCachedUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Check if a user is currently logged in.
 */
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

function _persistSession(response) {
  const { token, ...user } = response.data;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}
