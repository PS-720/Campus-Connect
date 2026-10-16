import apiClient from "./apiClient";

/**
 * Get paginated notifications for the current user (requires auth).
 * @param {{ page?, size?, unreadOnly? }} params
 */
export async function getNotifications(params = {}) {
  const response = await apiClient.get("/notifications", { params });
  return response.data;
}

/**
 * Mark a single notification as read.
 * @param {string} id
 */
export async function markNotificationRead(id) {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllNotificationsRead() {
  const response = await apiClient.patch("/notifications/read-all");
  return response.data;
}

/**
 * Delete a notification.
 * @param {string} id
 */
export async function deleteNotification(id) {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
}

/**
 * Get unread notifications count.
 */
export async function getUnreadCount() {
  const response = await apiClient.get("/notifications/unread-count");
  return response.data;
}
