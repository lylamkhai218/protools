# /debug - Root-Cause Debugging Protocol

Use this slash-command equivalent to methodically diagnose compile, lint, or runtime exceptions.

## 🛠️ Diagnostics Sequence

1. **Locate the Failure Context**: Identify the file and line number where the exception or fail-state occurred.
2. **Trace Backwards**: Find the state variable, prop, or import statement feeding the broken line.
3. **Examine the Configuration & Dependencies**: Verify that the correct libraries are listed in `package.json` and loaded.
4. **Build a Directed Minimal Solution**: Formulate a micro-fix targeting the precise failure, rather than blindly refactoring adjacent blocks.
5. **Re-Validate**: Run validation commands (`tsc` and `npm run lint`) to isolate regression.
