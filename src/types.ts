import type { ReactNode } from 'react';

export type ChatMessageId = string | number;

export interface ChatMessage {
  id: ChatMessageId;
  conversationId: ChatMessageId;
  senderId?: ChatMessageId | null;
  senderName?: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  isFromCurrentUser?: boolean;
  metadata?: Record<string, unknown>;
}

export interface PaginatedChatMessages {
  results: ChatMessage[];
  next?: string | null;
}

export interface ChatClientOptions {
  apiBaseUrl: string;
  fetcher?: typeof fetch;
  headers?: HeadersInit | (() => HeadersInit);
}

export interface ChatClient {
  listMessages: (conversationId: ChatMessageId, nextUrl?: string | null) => Promise<PaginatedChatMessages>;
  sendMessage: (conversationId: ChatMessageId, content: string, metadata?: Record<string, unknown>) => Promise<ChatMessage>;
}

export interface ChatWindowProps {
  conversationId: ChatMessageId;
  currentUserId?: ChatMessageId | null;
  apiBaseUrl: string;
  websocketUrl?: string | null;
  headers?: HeadersInit | (() => HeadersInit);
  className?: string;
  messageListClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  renderMessage?: (message: ChatMessage) => ReactNode;
  onError?: (error: unknown) => void;
}
