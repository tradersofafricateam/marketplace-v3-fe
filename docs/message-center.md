# Message Center integration

## Pages and structure

- Buyer: `/[locale]/dashboard/messages`
- Seller: `/[locale]/seller/messages`
- Product enquiry: append `?recipientUserId=<marketplace-user-id>` to the inbox URL.
- Both inboxes share `src/features/messages` (API, types, helpers, hooks, atoms, molecules, organisms, templates).
- Existing account boundaries protect both routes; the server must enforce conversation membership on every request.
- Private query keys include the authenticated user ID. There is no fabricated conversation data, polling, or initial cached-history flash.

## Implemented REST contracts

Conversation list/search/unread filtering and pagination; start or reopen conversation; cursor-paginated message history; text/Unicode emoji sending; idempotent failed-send retry; replies; read receipts; header unread counts; edit, soft-delete and report actions. REST refresh is available explicitly and after network recovery. Existing image/file attachments render from the message response with safe URL schemes; deleted message content and attachments are hidden.

Sender actions remain subject to backend permissions and edit/delete windows. No admin settings or moderation endpoints are called by marketplace users. Backend error messages, including subscription limits, are surfaced without hardcoded plan names.

## Backend contracts still needed

1. **Secure upload service:** upload URL, multipart field names, response containing `fileId`, limits, and how marketplace users obtain allowed formats and limits. The spec documents only admin settings. The send API accepts attachment file IDs, but upload controls are not exposed until the secure service is known. Arbitrary URLs are never submitted as trusted uploads.
2. **Realtime transport:** WebSocket vs Socket.IO, URL/path, authentication, room subscription/authorization, event payloads, reconnect sync contract. The spec lists event names but not a connectable transport. No simulated online/typing state is shown and no polling is used as a substitute.
3. **Seller mapping:** Product seller data must expose its marketplace `userId`, distinct from store/profile `id`. Messaging is unavailable when only a store ID is known. For chat header store/quote shortcuts, return verified seller metadata and its store `slug`, or supply the documented user-to-store lookup endpoint. A quote shortcut navigates to the store to select a product; it never creates a quote in chat.

No live API or browser-end-to-end verification has been performed without backend/test account access.

## Empty-state illustration prompts

The page uses the supplied PNG sketches in `public/assets/images/sketchs/`, mapped in `MessageEmptyState.tsx`:

- No conversations: `messages-inbox-empty.png`
- No conversation selected: `messages-no-selection.png`
- Empty conversation: `messages-conversation-empty.png`
- No search results: `messages-search-empty.png`
- No unread conversations: `messages-unread-empty.png`

The prompts below can be used to generate matching replacements. These are illustrations, not UI icons.

### Shared art direction

Append this to each scene prompt:

> Editorial pencil-and-ink sketch for TOFA, an African B2B marketplace. Warm charcoal contour lines, slightly imperfect hand-drawn strokes, sparse cross-hatching, mostly white negative space, tiny muted burnt-orange accents (#D96836), subtle warm-gray ground shadow. Friendly, calm and professional. A small fully composed still life, not an isolated icon. No text, letters, logos, numbers, people, flags, gradients, glossy 3D, or interface mockups. Transparent background. Landscape 3:2 canvas, 1200 × 800 pixels. Keep all objects inside the central 75% of the frame and ensure clarity when reduced to 240px wide. Match the same drawing style across the full set.

### 1. No conversations — `inbox`

> Draw an empty shallow wooden correspondence tray on a desk, one sealed envelope floating gently above it as though a first business connection is about to arrive. A few restrained pencil motion marks and a soft shadow under the tray. Quiet anticipation, inviting but not childish.

### 2. No conversation selected — `selection`

> Draw two overlapping handwritten correspondence sheets, a small folded envelope, and a pencil resting diagonally beside them. Suggest an ongoing business exchange through the arrangement, without legible marks or speech-bubble icons. Balanced, open composition with a warm welcoming mood.

### 3. Conversation has no messages — `conversation`

> Draw an open blank letter with a gently curled corner and a pencil leaning alongside it, ready to write the first line. A folded envelope rests partly behind the paper. The scene should communicate starting a thoughtful conversation, with generous white space.

### 4. Search has no results — `search`

> Draw a magnifying glass resting over a small open correspondence folder containing a few blank sheets. The lens reveals only clean paper. A subtle tilted envelope sits beside the folder. Communicate a calm invitation to try another search, never alarm or failure.

### 5. No unread conversations — `unread`

> Draw a neatly stacked set of opened letters and envelopes beside a tiny potted sprout on a desk. One pencil rests horizontally in front. Everything feels organized and finished, communicating that the inbox is caught up. Use one restrained burnt-orange leaf detail; no checkmark icon.
