# PM Chat React

Reusable React chat components and hooks.

This package is intentionally backend-agnostic. It expects a paginated message
API and an optional WebSocket endpoint, but it does not depend on any product
domain or application-specific model.

## Install

Use it as a local package:

```json
{
  "dependencies": {
    "@projectmaker/pm-chat-react": "file:../packages/pm-chat-react"
  }
}
```

## Basic Usage

```tsx
import { ChatWindow } from '@projectmaker/pm-chat-react';

export function SupportChat() {
  return (
    <ChatWindow
      conversationId="support-room"
      currentUserId="user-1"
      apiBaseUrl="/chat-api"
      websocketUrl="wss://example.com/ws/chat/support-room/"
    />
  );
}
```

## Expected API

`GET {apiBaseUrl}/conversations/{conversationId}/messages/`

Returns either an array of messages or a paginated response:

```json
{
  "results": [],
  "next": "/chat-api/conversations/support-room/messages/?page=2"
}
```

`POST {apiBaseUrl}/conversations/{conversationId}/messages/`

Accepts:

```json
{
  "content": "Hello"
}
```

Returns the created message.

## WebSocket Events

The socket may send either a message directly or an event wrapper:

```json
{
  "type": "message.created",
  "message": {
    "id": "1",
    "conversationId": "support-room",
    "senderId": "user-1",
    "content": "Hello",
    "createdAt": "2026-06-06T00:00:00Z"
  }
}
```

## Exports

- `ChatWindow`
- `MessageList`
- `MessageBubble`
- `MessageInput`
- `useChatMessages`
- `useChatSocket`
- `createChatClient`
- shared TypeScript types
