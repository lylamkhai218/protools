# /review - Five-Axis Code Review Protocol

Conduct a systematic multi-perspective inspection of code changes. The "Five Autonomic Axes" include:

## 🧭 The 5 Review Axes

1. **Security & Data Privacy**
   - Verify that no secret API keys are exposed to the client bundle.
   - Confirm proper sanitization of URLs.
2. **Performance & Render Loops**
   - Review all `useEffect` containers for stale dependencies.
   - Look out for unnecessary re-evaluations of costly data objects (modularize objects using `useMemo`).
3. **Type Safety & Schema Conformance**
   - Run linter passes and check TypeScript definitions.
   - Avoid unhandled raw objects.
4. **User Experience & Styling Fidelity**
   - Inspect components for mobile responsiveness, responsive prefixes, and touch-target sizes (minimum 44px on mobile handles).
5. **Architectural Cohesiveness**
   - Check if new features respect the single-view constraint for simple tools or modular directory files for bigger apps.
