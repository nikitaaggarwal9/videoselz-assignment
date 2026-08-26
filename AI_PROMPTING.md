# AI Prompting Log

This log records substantial AI-assisted implementation, review, debugging, and architectural decisions. It intentionally excludes routine commands, autocomplete, formatting-only changes, and other minor edits.


## Interaction 1 — Repeatable seed data

- **Tool Used:** Codex
- **Context / Task:** Realistic products and videos plus enough engagement events to support meaningful analytics, while keeping the seed process repeatable.
- **Exact Prompt Used:** add dummy data in db by creating seed.js file
- **Outcome & Adjustments:** Added an explicit seed command that rebuilds the local SQLite schema and inserts a deterministic dataset inside a transaction. The dataset includes varied engagement levels and one video with no events so later analytics can verify zero-count behavior. No API work was included.


## Interaction 2 — Engagement event ingestion

- **Tool Used:** Codex
- **Context / Task:** Implement engagement events through `POST /api/events` with reasonable request validation and database insertion.
- **Exact Prompt Used:** "Implement Post /api/events Engagement event endpoint for posting events. it should validate the video_ID in query parameter and return a json response which contians created event on success, otherwise throw error"
- **Outcome & Adjustments:** Added a focused Express route that validates a positive integer video ID and an allowed event type, verifies that the referenced video exists, inserts the event through Sequelize, and returns the created event. Added consistent JSON responses for validation, missing-video, and unexpected-server errors. Analytics work remains deferred.
