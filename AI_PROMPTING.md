# AI Prompting Log

This log records substantial AI-assisted implementation, review, debugging, and architectural decisions. It intentionally excludes routine commands, autocomplete, formatting-only changes, and other minor edits.


## Interaction 1 — Repeatable seed data

- **Tool Used:** Codex
- **Context / Task:** Realistic products and videos plus enough engagement events to support meaningful analytics, while keeping the seed process repeatable.
- **Exact Prompt Used:** add dummy data in db by creating seed.js file
- **Outcome & Adjustments:** Added an explicit seed command that rebuilds the local SQLite schema and inserts a deterministic dataset inside a transaction. The dataset includes varied engagement levels and one video with no events so later analytics can verify zero-count behavior. No API work was included.

