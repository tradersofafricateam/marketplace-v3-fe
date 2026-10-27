# Local product wishlist

The shared ProductCard uses WishlistButton and src/store/wishlistStore.ts. IDs are stored under `tofa-local-wishlist` in this browser's localStorage. This temporary wishlist is not linked to an account, does not synchronize between devices, and persists across login/logout in the same browser. Clearing site data removes it. If storage is unavailable, it works in memory for the current session.

The local store is the sole source of selected state. Backend `isSaved` flags are not copied into it. Storage is rehydrated after mount so server and initial client markup match. Only IDs are persisted; no product records, user details or actions are serialized.

There are no wishlist API calls or invented endpoints. Future account-backed integration can replace the state source and toggle handler in WishlistButton while retaining its appearance and ProductCard integration. The separate existing Product Information save control is outside this increment and has not been changed.
