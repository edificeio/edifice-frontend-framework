# Homepage Module

The Homepage module provides React components for displaying flash messages and other homepage-related UI elements.

## Overview

This module is part of the Edifice Frontend Framework and contains components designed for the homepage experience, including notification systems and message displays.

## Components

### MessageFlashList

A container component that displays a list of flash messages with the ability to mark them as read.

**Features:**

- Displays flash messages in a vertical list
- Supports different message types (info, warning, etc.)
- Allows marking messages as read
- Responsive design with proper spacing
- Internationalization support

#### Components Structure

- **MessageFlashListContainer** - Smart container component that handles data fetching and state management
- **MessageFlashList** - Presentational component for rendering the list of messages
- **MessageFlash** - Individual message component with expand/collapse functionality

#### Usage

```tsx
import { MessageFlashListContainer } from '@edifice.io/react/homepage';

function Homepage() {
  return (
    <div>
      <MessageFlashListContainer />
    </div>
  );
}
```

#### Advanced Usage with Custom Loading State

For cases where you need to handle loading states externally or add custom loading UI:

```tsx
import {
  useMessageFlashList,
  MessageFlashList,
} from '@edifice.io/react/homepage';

function Homepage() {
  const { messages, isLoading, error, handleMarkAsRead } =
    useMessageFlashList();

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <div className="spinner" />
        <span className="sr-only">Loading flash messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-danger">
        Error loading messages: {error.message}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div role="status" className="text-muted">
        No messages to display.
      </div>
    );
  }

  return (
    <MessageFlashList messages={messages} onCloseMessage={handleMarkAsRead} />
  );
}
```

#### Props

##### MessageFlashListContainer

No props required - handles its own data fetching and state. Returns `null` if no messages are available or if an error occurs.

##### useMessageFlashList Hook

Custom hook that exposes loading states and data management externally.

**Returns:** `UseMessageFlashListReturn`

| Property           | Type                                    | Description                                     |
| ------------------ | --------------------------------------- | ----------------------------------------------- |
| `messages`         | `IFlashMessageModel[] \| undefined`     | Array of flash messages or undefined if loading |
| `isLoading`        | `boolean`                               | Loading state for fetching messages             |
| `error`            | `Error \| null`                         | Error state from fetching messages              |
| `handleMarkAsRead` | `(message: IFlashMessageModel) => void` | Handler to mark a message as read               |

##### MessageFlashList

| Prop             | Type                                    | Required | Description                                      |
| ---------------- | --------------------------------------- | -------- | ------------------------------------------------ |
| `messages`       | `IFlashMessageModel[]`                  | Yes      | Array of flash messages to display               |
| `onCloseMessage` | `(message: IFlashMessageModel) => void` | No       | Callback when a message is closed/marked as read |

##### MessageFlash

| Prop             | Type                                    | Required | Description                         |
| ---------------- | --------------------------------------- | -------- | ----------------------------------- |
| `message`        | `IFlashMessageModel`                    | Yes      | Flash message object to display     |
| `onCloseMessage` | `(message: IFlashMessageModel) => void` | No       | Callback when the message is closed |

## Services

The module includes several React Query hooks and custom hooks for data management:

- **useMessagesFlash** - Fetches flash messages from the API
- **useMarkAsRead** - Mutation hook for marking messages as read
- **useMessageFlashList** - High-level hook that combines data fetching and handlers with exposed loading states

## API Integration

The components integrate with the Edifice backend API to:

- Fetch flash messages for the current user
- Mark messages as read when dismissed
- Handle different message types and priorities

## Styling

Components follow the Edifice design system and use:

- Bootstrap 5 utilities
- Custom CSS classes for specific styling
- Responsive design principles
- Proper semantic HTML structure

## Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- Proper focus management
- Color contrast compliance
- Semantic HTML structure

## Internationalization

Messages content supports multiple languages through:

- Language-specific content objects
- Fallback to French if current language unavailable
- Integration with react-i18next for UI labels

## Development

### File Structure

```
components/
├── MessageFlashList/
│   ├── index.tsx                     # Exports
│   ├── MessageFlashListContainer.tsx # Container component
│   ├── MessageFlashList.tsx          # List component
│   ├── MessageFlash.tsx              # Individual message component
│   ├── *.stories.tsx                 # Storybook stories
│   └── services/                     # API hooks and queries
│       ├── index.ts
│       ├── api/
│       └── queries/
└── index.tsx                         # Module exports
```

### Testing

Components include Storybook stories for visual testing and documentation. To view the stories:

```bash
pnpm run docs
```

### Best Practices

1. **Container/Presenter Pattern**: Separate data logic (containers) from presentation (components)
2. **TypeScript**: Full type safety with proper interfaces
3. **React Query**: Efficient data fetching and caching
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Optimized rendering with proper key props
6. **Testing**: Comprehensive Storybook coverage

## Examples

### Basic Implementation

```tsx
import { MessageFlashListContainer } from '@edifice.io/react/homepage';

function App() {
  return (
    <main>
      <h1>Welcome to Edifice</h1>
      <MessageFlashListContainer />
    </main>
  );
}
```

### External Loading State Management

```tsx
import {
  useMessageFlashList,
  MessageFlashList,
} from '@edifice.io/react/homepage';

function CustomHomepage() {
  const { messages, isLoading, error, handleMarkAsRead } =
    useMessageFlashList();

  return (
    <main>
      <h1>Welcome to Edifice</h1>

      {isLoading && (
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" />
          Loading messages...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          Failed to load messages. Please try again.
        </div>
      )}

      {messages && messages.length > 0 && (
        <MessageFlashList
          messages={messages}
          onCloseMessage={handleMarkAsRead}
        />
      )}

      {messages && messages.length === 0 && !isLoading && (
        <p className="text-muted">No new messages.</p>
      )}
    </main>
  );
}
```

### Custom Message Handling

```tsx
import { MessageFlashList } from '@edifice.io/react/homepage';
import { IFlashMessageModel } from '@edifice.io/client';

function CustomMessageHandler() {
  const [messages, setMessages] = useState<IFlashMessageModel[]>([]);

  const handleMessageClose = (message: IFlashMessageModel) => {
    // Custom logic for message dismissal
    console.log('Message closed:', message.id);
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
  };

  return (
    <MessageFlashList messages={messages} onCloseMessage={handleMessageClose} />
  );
}
```

## Related

- [@edifice.io/client](../../../client) - Client library with API types
- [Bootstrap Components](../../components) - Base UI components
- [Icons](../../icons) - Icon components used in messages
