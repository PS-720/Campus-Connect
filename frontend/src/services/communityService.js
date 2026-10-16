import apiClient from "./apiClient";

/**
 * Fetch all communities, optionally filtered by category.
 * @param {string} [category] - e.g. "Technology". Omit or pass "All" for all.
 */
export async function getCommunities(category) {
  const params = category && category !== "All" ? { category } : {};
  const response = await apiClient.get("/communities", { params });
  return response.data;
}

/**
 * Get a single community by id.
 * @param {string} id
 */
export async function getCommunityById(id) {
  const response = await apiClient.get(`/communities/${id}`);
  return response.data;
}

/**
 * Create a new community (requires auth).
 * @param {{ name: string, description: string, category: string, tags?: string[], isPrivate?: boolean }} data
 */
export async function createCommunity(data) {
  const response = await apiClient.post("/communities", data);
  return response.data;
}

/**
 * Toggle join / leave a community (single endpoint on backend).
 * @param {string} communityId
 */
export async function toggleJoin(communityId) {
  const response = await apiClient.post(`/communities/${communityId}/join`);
  return response.data;
}

/**
 * Delete a community (moderator only).
 * @param {string} communityId
 */
export async function deleteCommunity(communityId) {
  await apiClient.delete(`/communities/${communityId}`);
}
