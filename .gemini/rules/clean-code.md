# clean-code.md - Clear & Sustainable Development

This document governs standard styling, composition, and logical complexity reduction.

## 📖 Best Practices
- **Logical Simplification**: Avoid deep nests. Use early returns and clear guards.
- **Self-Documenting Functions**: Write clean, modular methods with single responsibilities.
- **Type Explicitliness**: Provide strict interface types for custom parameters and hooks. Avoid loose typings to maintain robust compilation loops.
- **Resource Cleanup**: Always dismantle timers, event observers, or active network channels during React component unmount phases.
