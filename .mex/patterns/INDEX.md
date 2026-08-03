# Pattern Index

Lookup table for all pattern files in this directory. Check here before starting any task — if a pattern exists, follow it.

<!-- This file is populated during setup (Pass 2) and updated whenever patterns are added.
     Each row maps a pattern file (or section) to its trigger — when should the agent load it?

     Format — simple (one task per file):
     | [filename.md](filename.md) | One-line description of when to use this pattern |

     Format — anchored (multi-section file, one row per task):
     | [filename.md#task-first-task](filename.md#task-first-task) | When doing the first task |
     | [filename.md#task-second-task](filename.md#task-second-task) | When doing the second task |

     Example (from a Flask API project):
     | [add-api-client.md](add-api-client.md) | Adding a new external service integration |
     | [debug-pipeline.md](debug-pipeline.md) | Diagnosing failures in the request pipeline |
     | [crud-operations.md#task-add-endpoint](crud-operations.md#task-add-endpoint) | Adding a new API route with validation |
     | [crud-operations.md#task-add-model](crud-operations.md#task-add-model) | Adding a new database model |

     Keep this table sorted alphabetically. One row per task (not per file).
     If you create a new pattern, add it here. If you delete one, remove it. -->

| Pattern | Use when |
|---------|----------|
| [add-list-page.md#task-add-a-new-list-page](add-list-page.md#task-add-a-new-list-page) | Adding a new UTable-based list page |
| [add-list-page.md#task-add-a-filterable-multi-select-column](add-list-page.md#task-add-a-filterable-multi-select-column) | Adding a multi-select filter column to an existing table |
| [add-stammdaten-view.md](add-stammdaten-view.md) | Adding or editing a *View.vue used both as a list preview and an editable detail view |
| [debug-composable-gotchas.md](debug-composable-gotchas.md) | Something renders blank, hangs, or warns silently with no lint/typecheck error |
| [mongocamp-auth-integration.md](mongocamp-auth-integration.md) | Building or debugging any feature that depends on login/session state or role gating |
| [port-primevue-feature.md](port-primevue-feature.md) | A requested feature might already exist in scratch/midgard-portal-nuxt |
