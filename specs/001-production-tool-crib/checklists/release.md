# Release gates (not an implementation prerequisite checklist)

- [ ] Verified production PHP/schema and clean identity inventory.
- [ ] MariaDB concurrency/migrations and legacy Office regression passed.
- [ ] OCR measured on actual boxes; >=95% within 3s; no wrong valid identity in sample.
- [ ] Two supervised shifts reconciled.
- [ ] Private secrets rotated and deployment scoped.
- [ ] Backup/restore rehearsed; authorized release through standard deploy script.
