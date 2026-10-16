import apiClient from "./apiClient";

/**
 * Send study query to backend AI Assistant.
 * @param {string} subject
 * @param {string} query
 */
export async function askAIStudy(subject, query) {
  const response = await apiClient.post("/ai/study", { subject, query });
  return response.data;
}

/**
 * Request AI note summarization.
 * @param {FormData | { text: string, fileName?: string }} payload
 */
export async function summarizeDocument(payload) {
  if (payload instanceof FormData) {
    const response = await apiClient.post("/ai/summarize", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
  const response = await apiClient.post("/ai/summarize", payload);
  return response.data;
}

/**
 * Generate practice quiz questions from AI service.
 * @param {{ subject: string, topic: string, difficulty?: string, questionCount?: number }} params
 */
export async function generateAIQuiz(params) {
  const response = await apiClient.post("/ai/quiz", params);
  return response.data;
}
