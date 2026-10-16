import apiClient from "./apiClient";

/**
 * Get paginated list of notes (public).
 * @param {{ page?, size?, subject?, branch?, semester?, search? }} params
 */
export async function getNotes(params = {}) {
  const response = await apiClient.get("/notes", { params });
  return response.data;
}

/**
 * Get a single note by ID.
 */
export async function getNote(id) {
  const response = await apiClient.get(`/notes/${id}`);
  return response.data;
}

/**
 * Upload a new note (requires auth).
 * @param {FormData} formData - includes file + metadata fields
 */
export async function uploadNote(formData) {
  const response = await apiClient.post("/notes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Like a note (requires auth).
 */
export async function likeNote(id) {
  const response = await apiClient.post(`/notes/${id}/like`);
  return response.data;
}

/**
 * Download a note — increments download count.
 */
export async function downloadNote(id) {
  const response = await apiClient.get(`/notes/${id}/download`, {
    responseType: "blob",
  });
  return response;
}

/**
 * Bookmark a note (requires auth).
 */
export async function bookmarkNote(id) {
  const response = await apiClient.post(`/notes/${id}/bookmark`);
  return response.data;
}

/**
 * Rate a note (requires auth).
 * @param {string} id
 * @param {number} rating - 1 to 5
 */
export async function rateNote(id, rating) {
  const response = await apiClient.post(`/notes/${id}/rate`, { rating });
  return response.data;
}

/**
 * Get AI summary for a note (requires auth).
 */
export async function summarizeNote(id) {
  const response = await apiClient.post(`/notes/${id}/summarize`);
  return response.data;
}
