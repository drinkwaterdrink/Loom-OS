# LoomOS Command Deck

Current release: **0.1.1**

LoomOS is a full-stack Lumiverse Spindle extension that compiles roleplay chat
history into an exact-swipe, structured story operating system. It tracks what
changed, what must remain true, where everyone and everything is, which story
threads are active, and what compact context is useful for the next reply.

## What You Get

- Exact `chatId + messageId + swipeId` snapshots with no silent fallback.
- Native in-chat modal viewer, drawer workspace, input action, and latest-message
  Generate/Open controls.
- Quiet LLM generation with visible pipeline phases, cancellation, a 180-second
  default timeout, Zod validation, and one repair attempt.
- Existing valid state remains untouched when both generation attempts are bad.
- Compact previous-state seeds for continuity and meaningful turn deltas.
- Optional compact prompt injection under a configurable token budget.
- Per-user Spindle storage only. Runtime code never uses filesystem APIs.
- Mobile-safe scoped CSS, native Lumiverse surfaces, and full teardown logic.

## Tracker Modules

LoomOS has 18 stable modules:

| Group | Modules |
| --- | --- |
| Core | Scene Kernel, Turn Deltas |
| Scene | Diagnostic Meters |
| Cast | Cast Core, Cast Visuals, Clothing, Relationships |
| World | Inventory, World & Space, Secrets & Rumors |
| Story | Story Threads, Continuity Firewall |
| Tools | Action Resolver, Dialogue State, Director Style, Closeness State, Image Prompt |
| System | Audit Log |

The five continuity-critical tracking modules are always on: Scene Kernel, Turn
Deltas, Cast Core, Story Threads, and Continuity Firewall. Their Display and
Inject controls can still be changed.

## Track, Display, Inject

Every module has three independent controls:

- **Track**: include the module in future compiler output.
- **Display**: show the module in the drawer and modal dashboard.
- **Inject**: allow a compact selection from the module into future prompts.

Turning Display off never deletes stored data. Turning Inject on has no effect
unless the module is also tracked, present in the exact snapshot, and global
compact injection is enabled.

## Presets

- **Lite**: core continuity plus Action Resolver.
- **Balanced**: recommended default with practical cast, world, inventory, and
  story tracking.
- **Full**: every stable module, excluding experimental tools.
- **Experimental**: every module, including dialogue, direction, closeness, and
  image prompt state.
- **Custom**: selected automatically after changing an individual module.

## State V2

Each stored snapshot contains:

```text
identity + generatedAt + source + activeModules
kernel + delta + meters + scene + castMatrix
worldState + storyState + continuityFirewall
tools + auditLog
```

The Kernel covers scene, location, time, weather, POV, tone, objective, current
focus, next focus, current risk, stop mode, and hard constraints. Cast records
cover intent, pose, proximity, awareness, threat, spotlight, visual identity,
clothing, relationships, leverage, inventory, and stable facts. World and Story
state cover spatial access, observers, hazards, rumors, secrets, loaded signs,
goals, conflicts, threads, stakes, countdowns, and autonomy.

## Exact Swipe Behavior

State is stored at:

```text
chats/{chatId}/messages/{messageId}/swipes/{swipeId}.json
```

When you switch or edit a swipe, LoomOS requests that exact key. If no snapshot
exists, the UI shows **Generate State**. It never displays a sibling swipe or a
nearby message as though it were current.

## Deltas And Continuity Seeds

When refreshing an existing snapshot, LoomOS can use that exact state as the
compiler seed. For a new snapshot, it walks backward through earlier messages
in the same chat and uses the nearest valid state from that earlier message's
active swipe. It never uses a sibling swipe on the target message.

The seed is compacted to scene/time, cast anchors, active threads, consequences,
inventory, and hard continuity facts. It is compiler context only and is never
rendered as the exact current state. The model compares it with the recent
transcript to produce the Delta headline, changed modules, changed facts,
carried-forward facts, and newly established facts.

## Generation Walkthrough

1. Open LoomOS from the input action, latest-message widget, or drawer.
2. Grant Generation and Chat Mutation. Grant Interceptor only when using
   compact injection.
3. Choose a ready Lumiverse connection or leave Automatic selected.
4. Select a preset and adjust module controls.
5. Open a chat message or swipe and press **Generate State**.
6. Watch the pipeline move through identity resolution, seed loading, prompt
   assembly, provider request, validation, optional repair, and storage.
7. Open the modal viewer to inspect the exact snapshot.

LoomOS calls:

```ts
spindle.generate.quiet({
  type: "quiet",
  messages,
  connection_id,
  reasoning: { source: "off" },
  userId,
  signal,
})
```

It does not force provider-specific JSON mode, temperature, or token parameters.
This keeps quiet generation compatible with the selected Lumiverse profile.

## Compact Prompt Injection

Injection is optional and skips internal quiet generations. It selects only
high-value fragments in this order:

1. Delta headline and meaningful changes.
2. Scene, location, time, and current focus.
3. Anti-retcon anchors and pending consequences.
4. Action Resolver state.
5. Main cast status, intent, and goals.
6. Spatial/access constraints and important inventory.
7. Active threads, stakes, and high/critical continuity risks.

The full dashboard and full JSON state are never injected.

## Safety And Performance

- LoomOS does not mutate user or assistant messages.
- All state is written to `spindle.userStorage`.
- Auto generation defaults to Manual.
- Compact injection defaults to off.
- Core tracking is locked on, but expensive experimental tools default off.
- Generated output is strict and array-capped.
- Characters remain non-explicit; unspecified ages are treated as adult and
  minors are never invented.
- Every owned listener, timer, widget, modal handler, job, and UI handle is
  cleaned up on extension teardown.

## Permissions

The manifest requests:

- `generation`: quiet compilation and connection discovery.
- `chat_mutation`: the current typed permission required by
  `spindle.chat.getMessages()` for chat-history reads. LoomOS does not mutate
  messages.
- `interceptor`: optional compact prompt injection.

`tokens` is not requested because `spindle.tokens.countText()` is a free API in
the current Lumiverse types.

## Migration

Legacy V1 settings are merged into V2 defaults. Legacy State V1 snapshots are
converted lazily when loaded and written back to the same exact storage key.
Original identity, core cast, threads, facts, consequences, secrets, and risks
are preserved in their closest V2 modules.

## Development And Verification

```powershell
npm.cmd install
npm.cmd run validate
npm.cmd run preview
```

`validate` checks synchronized release versions, strict TypeScript, backend and
frontend builds, focused regression tests, and blocked backend capabilities.

The local preview is:

```text
http://127.0.0.1:4173/preview/index.html
```

## Install In Lumiverse

Use this repository URL in the Spindle extension installer:

```text
https://github.com/drinkwaterdrink/Loom-OS.git
```

Enable the extension, grant the permissions you use, open a chat, and choose
**Open LoomOS** from the input actions.

See [CHANGELOG.md](CHANGELOG.md) for release history and
[docs/verified-api-map.md](docs/verified-api-map.md) for the typed API audit.
