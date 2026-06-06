import type { ChatClient, ChatClientOptions, ChatMessage, ChatMessageId, PaginatedChatMessages } from '../types';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeHeaders(headers?: HeadersInit | (() => HeadersInit)): HeadersInit {
  return typeof headers === 'function' ? headers() : headers || {};
}

function normalizeMessage(raw: any, conversationId: ChatMessageId): ChatMessage {
  return {
    id: raw.id,
    conversationId: raw.conversationId ?? raw.conversation_id ?? conversationId,
    senderId: raw.senderId ?? raw.sender_id ?? null,
    senderName: raw.senderName ?? raw.sender_name ?? null,
    content: raw.content ?? '',
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
    metadata: raw.metadata ?? {},
  };
}

function normalizeListResponse(raw: any, conversationId: ChatMessageId): PaginatedChatMessages {
  const rawResults = Array.isArray(raw) ? raw : raw.results || [];
  return {
    results: rawResults.map((item: any) => normalizeMessage(item, conversationId)),
    next: Array.isArray(raw) ? null : raw.next || null,
  };
}

export function createChatClient(options: ChatClientOptions): ChatClient {
  const fetcher = options.fetcher || fetch;
  const baseUrl = trimTrailingSlash(options.apiBaseUrl);

  return {
    async listMessages(conversationId, nextUrl) {
      const url = nextUrl || `${baseUrl}/conversations/${encodeURIComponent(String(conversationId))}/messages/`;
      const response = await fetcher(url, {
        headers: normalizeHeaders(options.headers),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to load chat messages: ${response.status}`);
      }
      return normalizeListResponse(await response.json(), conversationId);
    },

    async sendMessage(conversationId, content, metadata) {
      const response = await fetcher(`${baseUrl}/conversations/${encodeURIComponent(String(conversationId))}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...normalizeHeaders(options.headers),
        },
        credentials: 'include',
        body: JSON.stringify({ content, metadata }),
      });
      if (!response.ok) {
        throw new Error(`Failed to send chat message: ${response.status}`);
      }
      return normalizeMessage(await response.json(), conversationId);
    },
  };
}
