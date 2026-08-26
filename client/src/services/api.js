const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchVideoAnalytics({ page = 1, limit = 10, signal } = {}) {
  const searchParams = new URLSearchParams({ page, limit });
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/videos?${searchParams}`,
    { signal },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Unable to load video analytics.');
  }

  return response.json();
}

export async function createEngagementEvent({ videoId, eventType }) {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId, eventType }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Unable to simulate traffic.');
  }

  return response.json();
}
