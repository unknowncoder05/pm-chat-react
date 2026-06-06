import type { ReactNode } from 'react';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  hasOlder?: boolean;
  loadingOlder?: boolean;
  onLoadOlder?: () => void;
  renderMessage?: (message: ChatMessage) => ReactNode;
  className?: string;
  loadOlderLabel?: string;
  loadingOlderLabel?: string;
}

export function MessageList({
  messages,
  hasOlder = false,
  loadingOlder = false,
  onLoadOlder,
  renderMessage,
  className = '',
  loadOlderLabel = 'Load older messages',
  loadingOlderLabel = 'Loading...',
}: MessageListProps) {
  return (
    <div className={`pm-chat-list ${className}`.trim()}>
      {hasOlder && (
        <button type="button" className="pm-chat-list__load-older" disabled={loadingOlder} onClick={onLoadOlder}>
          {loadingOlder ? loadingOlderLabel : loadOlderLabel}
        </button>
      )}
      {messages.map((message) => (
        <div key={String(message.id)} className="pm-chat-list__item">
          {renderMessage ? renderMessage(message) : <MessageBubble message={message} />}
        </div>
      ))}
    </div>
  );
}
