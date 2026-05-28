# Comprehensive Security Assessment Guide

---
name: Security Review
description: Safeguarding web workspaces against leak risks and cross-origin failures.
---

## 🛡️ Best Practices
- Never include active credentials inside client scripts.
- Keep third-party secrets isolated in server-side controller components.
- Label all active interactive components with descriptive, unique `id` selectors for styling/testing hooks.
- Configure safe image properties using JSX `referrerPolicy="no-referrer"` variables.
