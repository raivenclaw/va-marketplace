"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/actions";

export function SendMessageForm({ receiverId }: { receiverId: string }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus("sending");
    const result = await sendMessage(receiverId, content);
    if (result.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setContent("");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Schrijf je bericht..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
      />
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
      {status === "sent" && (
        <p className="text-green-600 text-sm mt-1">Bericht verzonden!</p>
      )}
      <button
        type="submit"
        disabled={status === "sending" || !content.trim()}
        className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Verzenden..." : "Verstuur bericht"}
      </button>
    </form>
  );
}
