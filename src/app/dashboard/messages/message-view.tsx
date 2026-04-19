"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
}

interface MessageViewProps {
  messages: Message[];
  currentUserId: string;
  profileMap: Record<string, { full_name: string; avatar_url: string | null }>;
  userName: string;
  conversationId: number;
  receiverId: string;
}

export function MessageView({
  messages,
  currentUserId,
  profileMap,
  userName,
  conversationId,
  receiverId,
}: MessageViewProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    await sendMessage(receiverId, content);
    setContent("");
    setSending(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          const sender = isMine
            ? { full_name: userName }
            : profileMap[msg.sender_id] || { full_name: "Onbekend" };

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                  isMine
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isMine ? "text-indigo-200" : "text-gray-500"}`}>
                  {sender.full_name}
                </p>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMine ? "text-indigo-200" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Typ een bericht..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {sending ? "..." : "Verstuur"}
        </button>
      </form>
    </div>
  );
}
