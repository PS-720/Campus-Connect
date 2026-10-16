import apiClient from "./apiClient";

const AUTH_KEY = "cc_user";
const TOKEN_KEY = "cc_token";

/**
 * Register a new user account.
 * Handles payload mapping between UI form fields and backend model.
 * @param {{ name?, fullName?, email, password, university?, department?, year?, yearOfStudy?, interests? }} data
 */
export async function register(data) {
  let yearNumber = data.yearOfStudy;
  if (!yearNumber && data.year) {
    const match = String(data.year).match(/\d+/);
    yearNumber = match ? parseInt(match[0], 10) : 1;
  }

  const payload = {
    name: (data.name || data.fullName || "").trim(),
    email: (data.email || "").trim(),
    password: data.password,
    university: (data.university || "Campus University").trim(),
    department: (data.department || "Computer Science").trim(),
    yearOfStudy: yearNumber || 1,
    interests: Array.isArray(data.interests) ? data.interests : [],
  };

  const response = await apiClient.post("/auth/register", payload);
  _persistSession(response);
  return response.data;
}

/**
 * Login with email and password.
 * @param {{ email, password }} credentials
 */
export async function login(credentials) {
  const payload = {
    email: (credentials.email || "").trim(),
    password: credentials.password,
  };
  const response = await apiClient.post("/auth/login", payload);
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
  if (response && response.data) {
    const { token, ...user } = response.data;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
  }
}
