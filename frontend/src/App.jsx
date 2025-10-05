import { useEffect, useState } from "react";
import { listMessages, createMessage, updateMessage } from "./api";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ username: "", text: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setError("");
      const data = await listMessages();
      setMessages(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const username = form.username.trim();
    const text = form.text.trim();
    if (!username || !text) return;
    setBusy(true);
    try {
      await createMessage({ username, text });
      setForm({ username, text: "" });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onUpdate(id, newText) {
    try {
      await updateMessage(id, { text: newText });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="app">
      <h1 className="app__title">Anslagstavla</h1>

      <form className="form" onSubmit={onSubmit}>
        <textarea
          className="textarea"
          placeholder="Skriv ett meddelande…"
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Användarnamn"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />
        <button className="button" disabled={busy}>
          {busy ? "Publicerar…" : "Publicera"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {messages.map((m) => (
          <li key={m.id} className="card">
            <div className="card__time">
              {new Date(m.createdAt).toLocaleString("sv-SE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            <EditableText text={m.text} onSave={(t) => onUpdate(m.id, t)} />
            <div className="card__user">— {m.username}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}

function EditableText({ text, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  useEffect(() => setDraft(text), [text]);

  if (!editing) {
    return (
      <p
        className="card__text"
        onDoubleClick={() => setEditing(true)}
        title="Dubbelklicka för att redigera"
      >
        {text}
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <textarea
        className="textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="button"
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
        >
          Spara
        </button>
        <button
          className="button"
          style={{ background: "#555" }}
          onClick={() => {
            setEditing(false);
            setDraft(text);
          }}
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
