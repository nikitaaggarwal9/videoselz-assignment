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


## Interaction 3 — Video analytics aggregation

- **Tool Used:** Codex
- **Context / Task:** Implement `GET /api/analytics/videos` with SQL aggregation for views, clicks, and add-to-cart conversions, without adding pagination yet.
- **Exact Prompt Used:** “Implement GET /api/analytics/videos to return each video with its product details and counts for views, clicks, and add-to-cart events. Use a single SQL query with joins and conditional counting, and include videos with no events as zero counts. Skip pagination for now.”
- **Outcome & Adjustments:** Added an analytics route that aggregates event types in the database through Sequelize. After performance review, replaced three scoped event joins with one engagement join grouped by event type, avoiding a potentially huge Cartesian intermediate result. Added a composite event lookup index and reshape the maximum three grouped rows per video into the API response. Videos with no engagement remain in the result with zero metrics. Pagination remains deferred.


## Interaction 4 — Analytics pagination

- **Tool Used:** Codex
- **Context / Task:** Add backend pagination to the video analytics endpoint, return useful metadata, and test validation and boundary cases.
- **Exact Prompt Used:** “Add page and limit pagination to GET /api/analytics/videos. Validate the parameters, set defaults and a maximum limit, and apply pagination before aggregating events. Return the analytics with total results and previous/next-page information, and handle invalid values.”
- **Outcome & Adjustments:** Added validated `page` and `limit` parameters with defaults and a maximum page size. The route first selects the requested page of video IDs and then aggregates events only for those videos, preventing grouped event rows from splitting metrics across page boundaries. The response now includes totals and previous/next-page indicators.
