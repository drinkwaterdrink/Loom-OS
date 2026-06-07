# Verified Lumiverse API Map

Verified on June 7, 2026 against:

- `lumiverse-spindle-types@0.5.21`
- <https://docs.lumiverse.chat/>

## Permissions

| Permission | Verified API | LoomOS use | Degraded behavior |
| --- | --- | --- | --- |
| `generation` | `spindle.generate.quiet()` | Compile story state | Generate controls remain disabled |
| `chat_mutation` | `spindle.chat.getMessages()` | Read exact message and swipe content | No state loading or compilation |
| `interceptor` | `spindle.registerInterceptor()` | Optional compact state injection | Dashboard still works without injection |

`tokens` is not a manifest permission. `spindle.tokens.countText()` is a free API.
Drawer tabs, input-bar actions, message widgets, context menus, storage, events,
logging, frontend/backend messaging, and token counting are also free APIs.

The extension does not request `chats`, `context_handler`, `ui_panels`,
`event_tracking`, or `app_manipulation`.

## Verified API Names

- Backend global: `SpindleAPI`
- Frontend context: `SpindleFrontendContext`
- Drawer: `ctx.ui.registerDrawerTab()`
- Input action: `ctx.ui.registerInputBarAction()`
- Message action: `ctx.messages.renderWidget()`
- Active chat: `ctx.getActiveChat()`
- Latest message: `ctx.messages.getLatestMessageId()`
- Per-user storage: `spindle.userStorage.getJson()` / `setJson()` / `delete()`
- Chat history: `spindle.chat.getMessages()`
- Quiet generation: `spindle.generate.quiet()`
- Connection discovery: `spindle.connections.list()`
- Prompt injection: `spindle.registerInterceptor()`
- Native viewer: `ctx.ui.showModal()`
- Token budget: `spindle.tokens.countText()`
- Swipe events: `MESSAGE_SWIPED` and `SWIPE_EDITED`
- Live permission changes: `spindle.permissions.onChanged()`

Swipe identity is the typed numeric `ChatMessageDTO.swipe_id`. The exact storage
key is:

```text
chats/{chatId}/messages/{messageId}/swipes/{swipeId}.json
```

Path segments are percent-encoded before they reach Spindle storage.

## Generation Compatibility Notes

LoomOS does not force `temperature`, `max_tokens`, or provider-native structured
output fields. It uses prompt-engineered JSON, validates with Zod, and retries
once with a repair prompt. The response adapter accepts the current typed
`unknown` return and normalizes raw strings plus `content`, `text`, `output`,
`response`, `message`, and `message.content` shapes.

Every generation has an `AbortSignal`, a configurable timeout, targeted
operator-scoped `userId`, and visible frontend pipeline reports.
