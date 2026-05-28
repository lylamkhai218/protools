# /test - TDD & Verification Protocol

Testing and compilation checks are non-negotiable requirements. Before proclaiming a feature complete, verify compilation integrity.

## 🛠️ Verification Commands

- Ensure that any modular updates pass standard syntax and type assertion passes:
  - **Linter pass**: `npm run lint` or generic framework linter commands.
  - **Compiler validation**: `tsc --noEmit` or generic framework compilation systems.

## 🧪 Red-Green-Refactor Flow

1. Identify missing capabilities or error states.
2. Outline exact test behaviors.
3. Make contiguous block changes targeting precise execution goals.
4. Execute validation checks immediately to guarantee zero regressions.
