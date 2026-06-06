import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  className?: string;
}

export function MessageBubble({ message, className = '' }: MessageBubbleProps) {
  const alignment = message.isFromCurrentUser ? 'pm-chat-message--own' : 'pm-chat-message--other';

  return (
    <article className={`pm-chat-message ${alignment} ${className}`.trim()}>
      {message.senderName && (
        <div className="pm-chat-message__sender">{message.senderName}</div>
      )}
      <div className="pm-chat-message__body">{message.content}</div>
      <time className="pm-chat-message__time" dateTime={message.createdAt}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </article>
  );
}
