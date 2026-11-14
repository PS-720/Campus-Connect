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

/**
 * Upload a media file (photo, video, or attachment) for a post.
 * @param {File} file
 * @returns {Promise<{ url: string, filename: string, fileType: string, size: number }>}
 */
export async function uploadPostMedia(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/posts/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Resolves a media URL whether it's absolute, data URL, blob URL, or relative backend path.
 * @param {string} url
 */
export function resolveMediaUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
  const origin = base.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}
