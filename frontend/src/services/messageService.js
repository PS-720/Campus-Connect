import apiClient from "./apiClient";

/**
 * Get conversations list for the current user.
 */
export async function getConversations() {
  const response = await apiClient.get("/messages/conversations");
  return response.data;
}

/**
 * Get messages in a conversation with a specific user.
 * @param {string} userId - The other participant's user ID
 * @param {{ page?, size? }} params
 */
export async function getMessages(userId, params = {}) {
  const response = await apiClient.get(`/messages/${userId}`, { params });
  return response.data;
}

/**
 * Send a direct message to a user (requires auth).
 * @param {string} recipientId
 * @param {string} content
 */
export async function sendMessage(recipientId, content) {
  const response = await apiClient.post("/messages", { recipientId, content });
  return response.data;
}

/**
 * Mark a conversation as read.
 * @param {string} userId - The other participant's user ID
 */
export async function markConversationRead(userId) {
  const response = await apiClient.patch(`/messages/${userId}/read`);
  return response.data;
}
