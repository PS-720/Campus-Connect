import apiClient from "./apiClient";

/**
 * Normalize event from backend: Jackson serializes boolean `isRegistered()`
 * as "registered" in JSON, but all frontend code expects `isRegistered`.
 */
function normalizeEvent(ev) {
  if (!ev) return ev;
  return {
    ...ev,
    // Map backend "registered" -> "isRegistered" used throughout the UI
    isRegistered: ev.isRegistered !== undefined ? ev.isRegistered : ev.registered,
  };
}

/**
 * Get all events (public).
 * @param {{ category?, status?, page?, size? }} params
 */
export async function getEvents(params = {}) {
  const response = await apiClient.get("/events", { params });
  // apiClient interceptor unwraps to ApiResponse body; response.data is the event array
  const list = response?.data ?? response;
  if (Array.isArray(list)) return list.map(normalizeEvent);
  return list;
}

/**
 * Get a single event by ID.
 */
export async function getEvent(id) {
  const response = await apiClient.get(`/events/${id}`);
  return normalizeEvent(response?.data ?? response);
}

/**
 * Create an event (requires auth + moderator/admin).
 */
export async function createEvent(data) {
  const response = await apiClient.post("/events", data);
  return response.data;
}

/**
 * Register for an event (requires auth).
 */
export async function registerForEvent(id) {
  const response = await apiClient.post(`/events/${id}/register`);
  return normalizeEvent(response?.data ?? response);
}

/**
 * Unregister from an event (requires auth).
 */
export async function unregisterFromEvent(id) {
  const response = await apiClient.delete(`/events/${id}/register`);
  return normalizeEvent(response?.data ?? response);
}
