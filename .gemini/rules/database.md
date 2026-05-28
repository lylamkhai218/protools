# database.md - Data Persistors & Storage Integrity

Define client-side local storages or robust database operations.

## 🗄️ Standards
- **Client Cache**: Utilise standard `localStorage` wrapper variables to cache user configurations and cart selections comfortably.
- **Data Deduplication**: Keep central lists (such as `PRODUCTS`) in static modules to bypass redundant, slow mapping queries.
- **Clean Schemas**: Represent every item category utilizing structured type declarations inside `src/types.ts`.
