const BASE = import.meta.env.VITE_API_BASE_URL;

export async function listMessages() {
  const r = await fetch(`${BASE}/messages`);
  if (!r.ok) throw new Error("Failed to fetch messages");
  return r.json();
}
export async function createMessage({ username, text }) {
  const r = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, text }),
  });
  if (!r.ok) throw new Error("Failed to create message");
  return r.json();
}

export async function updateMessage(id, { text }) {
  const r = await fetch(`${BASE}/messages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error("Failed to update message");
  return r.json();
}
