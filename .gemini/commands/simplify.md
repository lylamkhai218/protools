# /simplify - Code Simplification Protocol

When code grows overly nested, redundant, or hard to trace, execute this streamlining protocol.

## ✂️ Methods of Elimination
- **Extract Logical Helpers**: Move helper calculations or custom mapping dictionaries out of page components.
- **Flatten Nested Conditionals**: Use guard clauses and early return statements to optimize readability.
- **Decompose Mega-Components**: Split giant files (e.g., >400 lines) into neat sub-modules under `src/components/`.
- **Remove Redundant State**: Compute derived data in real-time inside `useMemo` hooks rather than keeping duplicate, asynchronous state hooks.
