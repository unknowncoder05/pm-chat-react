import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createChatClient } from '../services/createChatClient';
import type { ChatClient, ChatMessage, ChatMessageId } from '../types';

interface UseChatMessagesOptions {
  conversationId: ChatMessageId;
  apiBaseUrl?: string;
  client?: ChatClient;
  currentUserId?: ChatMessageId | null;
  headers?: HeadersInit | (() => HeadersInit);
  onError?: (error: unknown) => void;
}

function byCreatedAtAsc(a: ChatMessage, b: ChatMessage): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function mergeMessages(messages: ChatMessage[], incoming: ChatMessage[], currentUserId?: ChatMessageId | null): ChatMessage[] {
  const byId = new Map<ChatMessageId, ChatMessage>();
  [...messages, ...incoming].forEach((message) => {
    byId.set(message.id, {
      ...message,
      isFromCurrentUser: currentUserId != null && String(message.senderId) === String(currentUserId),
    });
  });
  return Array.from(byId.values()).sort(byCreatedAtAsc);
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const client = useMemo(() => (
    options.client || createChatClient({
      apiBaseUrl: options.apiBaseUrl || '',
      headers: options.headers,
    })
  ), [options.apiBaseUrl, options.client, options.headers]);
  const mountedRef = useRef(true);
  const onError = options.onError;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reportError = useCallback((error: unknown) => {
    onError?.(error);
  }, [onError]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.listMessages(options.conversationId);
      if (!mountedRef.current) return;
      setMessages(mergeMessages([], response.results, options.currentUserId));
      setNextPageUrl(response.next || null);
    } catch (error) {
      reportError(error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [client, options.conversationId, options.currentUserId, reportError]);

  const loadOlder = useCallback(async () => {
    if (!nextPageUrl || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const response = await client.listMessages(options.conversationId, nextPageUrl);
      if (!mountedRef.current) return;
      setMessages((current) => mergeMessages(current, response.results, options.currentUserId));
      setNextPageUrl(response.next || null);
    } catch (error) {
      reportError(error);
    } finally {
      if (mountedRef.current) setLoadingOlder(false);
    }
  }, [client, loadingOlder, nextPageUrl, options.conversationId, options.currentUserId, reportError]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => mergeMessages(current, [message], options.currentUserId));
  }, [options.currentUserId]);

  const sendMessage = useCallback(async (content: string, metadata?: Record<string, unknown>) => {
    const message = await client.sendMessage(options.conversationId, content, metadata);
    appendMessage(message);
    return message;
  }, [appendMessage, client, options.conversationId]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  return {
    messages,
    loading,
    loadingOlder,
    hasOlder: Boolean(nextPageUrl),
    loadOlder,
    appendMessage,
    sendMessage,
    reload: loadInitial,
  };
}
