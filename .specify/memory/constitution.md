# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Library-First -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. CLI Interface -->
[PRINCIPLE_2_DESCRIPTION]
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### [PRINCIPLE_3_NAME]
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Integration Testing -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->

## Effective Protools constitution - 2026-11-05

The scaffold placeholders above are retained historical template text, not operative rules. This appended section governs feature 001-production-tool-crib together with .project/constitution.md and user-approved decisions.

1. Preserve knowledge append-only. Record evidence as KNOWN, DECIDED or UNVERIFIED.
2. Never expose HTTP SQL bridges, production credentials, database dumps or customer documents. Use prepared statements for input queries and enforce server permissions and CSRF.
3. Preserve real inventory and account history. No production test pollution, no sample employee seeds, no automatic corrections of historical stock.
4. Additional genuine workshop accounts are authorized by the approved 2026-11-05 plan. No shared/ghost identities. Preserve the original four Office accounts.
5. One box label and shank code identify one tool. Receipt and inspection are separate. Transactions serialize custody and conserve WIP lengths.
6. Field OCR, MariaDB concurrency, actual hosting runtime and two supervised night shifts require evidence before release. A local smoke test is not production acceptance.
7. Deploy only through the standard backed-up release process. No root routing replacement for Office. Keep protected configuration outside webroot.
8. Trace requirement -> contract -> task -> source -> test. Graph is navigation evidence, never a substitute for source or tests.

Version: Production addendum 1.0. Ratified: 2026-11-05 by approved implementation request. No placeholder in this effective addendum.
