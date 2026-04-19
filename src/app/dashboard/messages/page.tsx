import { getCurrentUser, getConversations, getMessages } from "@/lib/actions";
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { MessageView } from "./message-view";

interface MessagesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const activeConvId = typeof params.conv === "string" ? parseInt(params.conv) : undefined;

  const conversations = await getConversations();

  // Get participant profiles
  const supabase = createServerSupabase();
  const participantIds = new Set<string>();
  for (const conv of conversations) {
    if (conv.participant_1 !== user.id) participantIds.add(conv.participant_1);
    if (conv.participant_2 !== user.id) participantIds.add(conv.participant_2);
  }

  const { data: profiles } = participantIds.size > 0
    ? await supabase
        .from("marketplace_profiles")
        .select("id, full_name, avatar_url")
        .in("id", [...participantIds])
    : { data: [] };

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  if (activeConvId) {
    messages = await getMessages(activeConvId);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Berichten</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Geen berichten</p>
            <p className="text-gray-400 text-sm mt-1">
              Start een gesprek door een bericht te sturen naar een VA
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex min-h-[500px]">
              {/* Conversation list */}
              <div className="w-80 border-r border-gray-200 overflow-y-auto">
                {conversations.map((conv) => {
                  const otherId =
                    conv.participant_1 === user.id
                      ? conv.participant_2
                      : conv.participant_1;
                  const other = profileMap.get(otherId);
                  const isActive = conv.id === activeConvId;

                  return (
                    <a
                      key={conv.id}
                      href={`/dashboard/messages?conv=${conv.id}`}
                      className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isActive ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {(other?.full_name || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {other?.full_name || "Onbekend"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(conv.last_message_at).toLocaleDateString("nl-NL")}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Message view */}
              <div className="flex-1">
                {activeConvId ? (
                  <MessageView
                    messages={messages}
                    currentUserId={user.id}
                    profileMap={Object.fromEntries(profileMap)}
                    userName={user.full_name || "Ik"}
                    conversationId={activeConvId}
                    receiverId={
                      conversations.find((c) => c.id === activeConvId)?.participant_1 === user.id
                        ? conversations.find((c) => c.id === activeConvId)?.participant_2 || ""
                        : conversations.find((c) => c.id === activeConvId)?.participant_1 || ""
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Selecteer een gesprek</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
