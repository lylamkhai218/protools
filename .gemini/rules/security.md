# security.md - Strict Workspace Safeguards

Critical configurations ensuring user-data privacy and preventing key leaks.

## 🔑 Crucial Instructions
- **Secrets Management**: List any new variables within `.env.example` immediately. Do not hardcode actual values in git records.
- **HTML Element ID Rules**: Ensure all interactive selectors (like cards or buttons) include a unique, meaningful `id` attribute for styling/testing hooks.
- **Iframe Sandboxes**: Utilize `referrerPolicy="no-referrer"` for all `<img>` representations to guarantee zero leaks of workspace tracking data.
