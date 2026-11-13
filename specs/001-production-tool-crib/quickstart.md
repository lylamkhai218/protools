# Local validation

Use scratch/php/php.exe for syntax checks. Domain tests use an isolated SQLite fixture only; MariaDB acceptance remains a separate gate. Never point tests at production.

Run Spec Kit prerequisite check with -RequireSpec -RequireTasks -IncludeTasks. Run scripts/refresh_production_graph.py using the Graphify tool interpreter after selected source changes. Query graph before navigation, verify actual source before edits.
