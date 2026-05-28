# api-conventions.md - Client-Server Integration Standards

Ensure secure, clean, and reliable standard contracts.

## 📡 Integrations Policies
- **Proxy Layer Requirements**: Keep all sensitive secrets on the server-side to prevent exposing keys to client browsers.
- **Clean Structure**: Wrap endpoints under `/api/...` sub-routes.
- **Payload Design**: Enforce predictable response bodies containing status codes and payload envelopes.
