import { FormEvent, useState } from 'react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({ onSend, placeholder = 'Type a message...', disabled = false, className = '' }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const content = value.trim();
    if (!content || sending || disabled) return;
    setSending(true);
    try {
      await onSend(content);
      setValue('');
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={`pm-chat-input ${className}`.trim()} onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled || sending}
        className="pm-chat-input__field"
      />
      <button type="submit" disabled={disabled || sending || !value.trim()} className="pm-chat-input__send">
        Send
      </button>
    </form>
  );
}
