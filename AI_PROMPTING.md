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


## Interaction 5 — Frontend analytics table integration
- **Tool Used**: Codex
- **Context / Task:** Connect the React frontend to the video analytics API, handle loading/error/empty states, and display the analytics in a readable table with conversion rates.
- **Exact Prompt Used:** “Connect the React app to GET /api/analytics/videos and display the data in a table. add basic API and proxy setup, handle loading, error, and empty states, and calculate the conversion rate in React. Keep the styling simple and skip frontend pagination for now.”
- **Outcome & Adjustments:**  Added a focused API service and Vite development proxy, then loaded the analytics when the application mounts. The basic list was replaced with a reusable semantic table showing the required video and engagement fields. Loading, error, and empty states were added, along with request cancellation to prevent stale state updates during development remounts. Conversion rates are calculated and formatted in React, with zero-view videos displaying 0.00%. Frontend pagination, responsive behavior, and broader visual styling remain deferred.



## Interaction 6 — Frontend pagination

- **Tool Used:** Codex
- **Context / Task:** Connect frontend pagination controls to the paginated analytics endpoint while preserving the existing loading, error, empty, and table states.
- **Exact Prompt Used:** “Add Previous and Next buttons to the analytics table. Use the backend page and limit parameters to load the correct page and update the data when the page changes.”
- **Outcome & Adjustments:** Added page state and a reusable accessible pagination control with Previous and Next actions. Analytics requests include `page` and `limit`, consume backend pagination metadata, and reload when the page changes. Traffic simulation remained deferred.


## Interaction 7 — Custom page-limit dropdown

- **Tool Used:** Codex
- **Context / Task:** Let users choose how many analytics records appear on each page and keep pagination valid when the limit changes.
- **Exact Prompt Used:** “Add custom page limit section on the frontend, as dropdown”
- **Outcome & Adjustments:** Added controlled page-size state and an accessible rows-per-page dropdown with 3, 5, 10, and 25 options. The selected value is sent as the API `limit`, analytics reload automatically, and the current page resets to one to avoid landing beyond the new final page.


## Interaction 8 — Traffic simulation

- **Tool Used:** Codex
- **Context / Task:** Add a Simulate Traffic action that creates a random allowed event for a randomly selected currently visible video, refreshes analytics, and provides loading and error feedback.
- **Exact Prompt Used:** “Add a Simulate Traffic button that creates a random allowed event for a random video on the current page. refresh the analytics after success, show loading and error feedback, and disable the button while the request is running.”
- **Outcome & Adjustments:** Added an engagement-event API service and a simulation button that selects from the current page's videos and the three allowed event types. After a successful POST, the current analytics page is fetched again so the affected metric and frontend conversion rate visibly update. The button is disabled during requests and announces success or failure.


## Interaction 9 — Responsive UI polish

- **Tool Used:** Codex
- **Context / Task:** Improve the completed dashboard's spacing, visual hierarchy, semantic structure, table usability, responsive behavior, controls, and loading, empty, error, and feedback states without redesigning its functionality.
- **Exact Prompt Used:** “Make the dashboard look cleaner and easier to use. Improve the spacing, table, buttons, and mobile layout. make the loading, error, and empty states clearer. Don’t change how the dashboard works.”
- **Outcome & Adjustments:** Introduced a restrained dashboard layout with a clear header and primary action, a persistent analytics card during refreshes, accessible feedback panels, keyboard-visible focus states, tabular numeric alignment, and touch-friendly controls. The table now scrolls horizontally in a labeled focusable region on small screens, while pagination stacks cleanly on mobile. Added reduced-motion support and retained the existing functionality unchanged.


## Interaction 10 — Background analytics refresh

- **Tool Used:** Codex
- **Context / Task:** Diagnose why clicking Simulate Traffic appeared to rerender the entire frontend and make the update visually stable.
- **Exact Prompt Used:** “When I click on simulate traffic button, frontend page is getting rendered completly, fix this.”
- **Outcome & Adjustments:** Identified that the simulation flow reused the foreground-loading state, causing several dashboard regions to change at once even though React preserved unchanged DOM. Changed the post-event fetch to a background refresh, kept the analytics table mounted, used the button and card to communicate progress, and reserved feedback space to prevent layout shifts. The affected analytics values now update without the page appearing to reload.


## Interaction 11 — Project documentation

- **Tool Used:** Codex
- **Context / Task:** Document the completed project, architecture, APIs, data model, setup, seeding, run commands, and presentation-link placeholders without inventing repository or presentation details.
- **Exact Prompt Used:** “Add a readme file which convers project set up and other necessary details which is generally helpful and found in documentaion.”
- **Outcome & Adjustments:** Added a README that reflects the implemented React, Express, Sequelize, and SQLite application. It covers local installation and execution, destructive repeatable seeding, scripts, model relationships and indexes, endpoint validation and response examples, pagination and aggregation behavior, frontend conversion calculation, architecture boundaries, and placeholders for the product pitch and technical walkthrough.