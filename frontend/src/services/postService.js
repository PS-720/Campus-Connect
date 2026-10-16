import apiClient from "./apiClient";

/**
 * Fetch social feed posts, optionally filtered by tag.
 * @param {string} [tag] - Optional topic hashtag filter (e.g. "Hackathon", "AI/ML")
 */
export async function getFeed(tag) {
  const params = tag && tag !== "All" ? { tag } : {};
  const response = await apiClient.get("/posts", { params });
  return response.data;
}

/**
 * Create a new post.
 * @param {{ content: string, tags?: string[], mediaUrls?: string[], communityId?: string }} data
 */
export async function createPost(data) {
  const response = await apiClient.post("/posts", data);
  return response.data;
}

/**
 * Toggle like on a post.
 * @param {string} postId
 */
export async function toggleLike(postId) {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
}

/**
 * Toggle bookmark on a post.
 * @param {string} postId
 */
export async function toggleBookmark(postId) {
  const response = await apiClient.post(`/posts/${postId}/bookmark`);
  return response.data;
}

/**
 * Get comments for a post.
 * @param {string} postId
 */
export async function getComments(postId) {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data;
}

/**
 * Add a comment to a post.
 * @param {string} postId
 * @param {string} content
 */
export async function addComment(postId, content) {
  const response = await apiClient.post(`/posts/${postId}/comments`, { content });
  return response.data;
}

/**
 * Delete a post (author only).
 * @param {string} postId
 */
export async function deletePost(postId) {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
}
