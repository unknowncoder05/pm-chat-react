import { useCallback } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatSocket } from '../hooks/useChatSocket';
import type { ChatWindowProps } from '../types';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

export function ChatWindow({
  conversationId,
  currentUserId,
  apiBaseUrl,
  websocketUrl,
  headers,
  className = '',
  messageListClassName = '',
  inputClassName = '',
  placeholder,
  renderMessage,
  onError,
}: ChatWindowProps) {
  const chat = useChatMessages({
    conversationId,
    currentUserId,
    apiBaseUrl,
    headers,
    onError,
  });

  useChatSocket({
    websocketUrl,
    enabled: Boolean(websocketUrl),
    onMessage: chat.appendMessage,
    onError,
  });

  const handleSend = useCallback(async (content: string) => {
    await chat.sendMessage(content);
  }, [chat]);

  return (
    <section className={`pm-chat-window ${className}`.trim()}>
      <MessageList
        messages={chat.messages}
        hasOlder={chat.hasOlder}
        loadingOlder={chat.loadingOlder}
        onLoadOlder={chat.loadOlder}
        renderMessage={renderMessage}
        className={messageListClassName}
      />
      <MessageInput
        onSend={handleSend}
        placeholder={placeholder}
        disabled={chat.loading}
        className={inputClassName}
      />
    </section>
  );
}
