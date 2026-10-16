import apiClient from "./apiClient";

/**
 * Get all events (public).
 * @param {{ category?, status?, page?, size? }} params
 */
export async function getEvents(params = {}) {
  const response = await apiClient.get("/events", { params });
  return response.data;
}

/**
 * Get a single event by ID.
 */
export async function getEvent(id) {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
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
  return response.data;
}

/**
 * Unregister from an event (requires auth).
 */
export async function unregisterFromEvent(id) {
  const response = await apiClient.delete(`/events/${id}/register`);
  return response.data;
}
