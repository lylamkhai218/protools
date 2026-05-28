# security-checklist.md - Security Audit Verification Checklist

An absolute checkout verification to enforce before releasing a production package.

- [ ] Clear of hardcoded API keys or authorization tokens inside client scripts.
- [ ] Image assets set standard `referrerPolicy="no-referrer"` directives.
- [ ] Target elements labeled with descriptive, unique `id` attributes.
- [ ] Safe sandbox restrictions active inside nested iframe references.
