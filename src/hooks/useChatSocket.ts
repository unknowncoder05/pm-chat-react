import { useEffect } from 'react';
import type { ChatMessage } from '../types';

interface UseChatSocketOptions {
  websocketUrl?: string | null;
  enabled?: boolean;
  onMessage: (message: ChatMessage) => void;
  onError?: (error: unknown) => void;
}

function parseSocketMessage(raw: MessageEvent<string>): ChatMessage | null {
  const payload = JSON.parse(raw.data);
  const message = payload.message || payload;
  if (!message || message.id == null) return null;
  return {
    id: message.id,
    conversationId: message.conversationId ?? message.conversation_id,
    senderId: message.senderId ?? message.sender_id ?? null,
    senderName: message.senderName ?? message.sender_name ?? null,
    content: message.content ?? '',
    createdAt: message.createdAt ?? message.created_at,
    updatedAt: message.updatedAt ?? message.updated_at ?? null,
    metadata: message.metadata ?? {},
  };
}

export function useChatSocket(options: UseChatSocketOptions) {
  const { enabled = true, onError, onMessage, websocketUrl } = options;

  useEffect(() => {
    if (!enabled || !websocketUrl) return;

    const socket = new WebSocket(websocketUrl);
    socket.onmessage = (event) => {
      try {
        const message = parseSocketMessage(event);
        if (message) onMessage(message);
      } catch (error) {
        onError?.(error);
      }
    };
    socket.onerror = (event) => onError?.(event);

    return () => socket.close();
  }, [enabled, onError, onMessage, websocketUrl]);
}
