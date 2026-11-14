import apiClient from "./apiClient";

/**
 * Normalize community from backend:
 * Jackson serializes boolean getters isMember() -> "member", isPrivate() -> "private".
 * The frontend always uses isMember / isJoined / isPrivate naming.
 */
function normalizeCommunity(c) {
  if (!c) return c;
  return {
    ...c,
    isMember: c.isMember !== undefined ? c.isMember : c.member,
    isPrivate: c.isPrivate !== undefined ? c.isPrivate : c.private,
    isModerator: c.isModerator !== undefined ? c.isModerator : c.moderator,
  };
}

/**
 * Fetch all communities, optionally filtered by category.
 * @param {string} [category] - e.g. "Technology". Omit or pass "All" for all.
 */
export async function getCommunities(category) {
  const params = category && category !== "All" ? { category } : {};
  const response = await apiClient.get("/communities", { params });
  // Community controller returns bare List<CommunityResponse> (no ApiResponse wrapper)
  // apiClient interceptor returns response.data = the array directly
  const list = Array.isArray(response) ? response : (response?.data ?? response);
  if (Array.isArray(list)) return list.map(normalizeCommunity);
  return list;
}

/**
 * Get a single community by id.
 * @param {string} id
 */
export async function getCommunityById(id) {
  const response = await apiClient.get(`/communities/${id}`);
  return normalizeCommunity(Array.isArray(response) ? response : (response?.data ?? response));
}

/**
 * Create a new community (requires auth).
 * @param {{ name: string, description: string, category: string, tags?: string[], isPrivate?: boolean }} data
 */
export async function createCommunity(data) {
  const response = await apiClient.post("/communities", data);
  return normalizeCommunity(Array.isArray(response) ? response : (response?.data ?? response));
}

/**
 * Toggle join / leave a community (single endpoint on backend).
 * @param {string} communityId
 */
export async function toggleJoin(communityId) {
  const response = await apiClient.post(`/communities/${communityId}/join`);
  return normalizeCommunity(Array.isArray(response) ? response : (response?.data ?? response));
}

/**
 * Delete a community (moderator only).
 * @param {string} communityId
 */
export async function deleteCommunity(communityId) {
  await apiClient.delete(`/communities/${communityId}`);
}
