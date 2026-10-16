import apiClient from "./apiClient";

/**
 * Get all communities (public).
 */
export async function getCommunities(params = {}) {
  const response = await apiClient.get("/communities", { params });
  return response.data;
}

/**
 * Get a single community by ID.
 */
export async function getCommunity(id) {
  const response = await apiClient.get(`/communities/${id}`);
  return response.data;
}

/**
 * Create a new community (requires auth).
 * @param {{ name, description, category, tags?, icon?, banner?, isPrivate? }} data
 */
export async function createCommunity(data) {
  const response = await apiClient.post("/communities", data);
  return response.data;
}

/**
 * Join a community (requires auth).
 */
export async function joinCommunity(id) {
  const response = await apiClient.post(`/communities/${id}/join`);
  return response.data;
}

/**
 * Leave a community (requires auth).
 */
export async function leaveCommunity(id) {
  const response = await apiClient.delete(`/communities/${id}/leave`);
  return response.data;
}
