import apiClient from "./apiClient";

/**
 * Get public profile of any user by ID.
 * @param {string} userId
 */
export async function getUserProfile(userId) {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

/**
 * Update own profile (requires auth).
 * @param {{ name?, bio?, university?, department?, yearOfStudy?, skills?, interests? }} data
 */
export async function updateProfile(data) {
  const response = await apiClient.put("/users/me", data);
  return response.data;
}

/**
 * Upload avatar (requires auth).
 * @param {FormData} formData - must contain 'avatar' file field
 */
export async function updateAvatar(formData) {
  const response = await apiClient.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Change password (requires auth).
 * @param {{ currentPassword, newPassword }} data
 */
export async function changePassword(data) {
  const response = await apiClient.patch("/users/me/password", data);
  return response.data;
}

/**
 * Get notes uploaded by the current user (requires auth).
 */
export async function getMyNotes() {
  const response = await apiClient.get("/users/me/notes");
  return response.data;
}

/**
 * Get bookmarked notes of the current user (requires auth).
 */
export async function getBookmarkedNotes() {
  const response = await apiClient.get("/users/me/bookmarks");
  return response.data;
}
