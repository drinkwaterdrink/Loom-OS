# LoomOS Command Deck

LoomOS Command Deck is a full-stack Lumiverse Spindle extension for compiling,
storing, injecting, and visualizing structured roleplay story state.

## Features

- Exact `chatId + messageId + swipeId` state snapshots
- Zod-validated quiet generation with one repair attempt
- Existing valid state is preserved when generated JSON is invalid
- Kernel, Cast Matrix, Thread Loom, and Continuity Firewall dashboards
- Seven scoped visual skins
- Compact optional prompt injection with a configurable token budget
- Drawer, input-bar action, and latest-message action
- Manual and optional automatic state compilation
- Live permission degradation and lifecycle cleanup

## Permissions

The manifest requests only:

- `generation`
- `chat_mutation`
- `interceptor`

It does not request `tokens`; token counting is a free API in the current
Lumiverse types.

## Development

```powershell
npm.cmd install
npm.cmd run validate
```

`npm.cmd run validate` typechecks, builds both bundles, runs focused regression
tests, and scans the backend bundle for blocked runtime capabilities.

## Storage

Settings and story state use `spindle.userStorage` only. No extension runtime
code imports Node or Bun filesystem APIs.

```text
settings.json
chats/{chatId}/messages/{messageId}/swipes/{swipeId}.json
```

State never falls back to another swipe. Swipe edits invalidate the affected
snapshot; operations that can shift indexes invalidate every snapshot for that
message.

See [docs/verified-api-map.md](docs/verified-api-map.md) for the current typed
API mapping.

## Install In Lumiverse

Use this repository URL in the Spindle extension installer:

```text
https://github.com/drinkwaterdrink/Loom-OS.git
```

After installation, enable the extension and grant its three requested
permissions. The drawer appears as **LoomOS**.
