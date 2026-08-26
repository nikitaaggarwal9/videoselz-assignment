# YouTube Pitch
https://youtu.be/qQMQ9WlODmI

# Technical Video Walkthrough: 
https://youtu.be/riJpU0gSL2M


# Videoselz Shoppable Video Analytics Dashboard

A simplified full-stack analytics dashboard for shoppable product videos. It displays engagement metrics for each video, calculates add-to-cart conversion rates, supports pagination, and can generate sample traffic from the interface.

## Features

- Paginated video analytics with product details
- Aggregated view, click, and add-to-cart event counts
- Frontend conversion-rate calculation with zero-view handling
- Configurable rows per page
- Traffic simulation for currently displayed videos
- Loading, empty, error, and request-feedback states
- Responsive and keyboard-accessible interface
- Repeatable local seed data

## Technology

- **Client:** React, Vite, and plain CSS
- **Server:** Node.js and Express
- **Database:** SQLite
- **Database access:** Sequelize

Sequelize keeps the three models and their relationships explicit in separate files. The application remains a single client, a single server, and one local SQLite database; no additional infrastructure is required.

## Project structure

```text
videoselz-assignment/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsTable.jsx
│   │   │   └── Pagination.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── data/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   └── seed.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   ├── Video.js
│   │   │   ├── EngagementEvent.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── analytics.js
│   │   │   └── events.js
│   │   └── index.js
│   └── package.json
├── AI_PROMPTING.md
└── README.md
```

## Local setup

### Prerequisites

- Node.js 20.19 or newer
- npm

### Install dependencies

From the project root:

```bash
cd server
npm install

cd ../client
npm install
```

### Seed the database

```bash
cd server
npm run seed
```

The seed command recreates the local tables and inserts:

- 4 products
- 5 videos
- 120 engagement events

Seeding is intentionally repeatable and destructive: `sequelize.sync({ force: true })` replaces existing local data each time. One seeded video has no events so zero-count and zero-conversion behavior can be verified.

### Start the server

In one terminal:

```bash
cd server
npm run dev
```

The API starts at `http://localhost:3001` by default.

### Start the client

In another terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

During local development, Vite proxies `/api` requests to the server on port 3001. A different API origin can be supplied with the optional `VITE_API_BASE_URL` environment variable. The server port can be changed with `PORT`.

## Available scripts

### Client

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production client build |
| `npm run preview` | Preview the production build locally |

### Server

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express with Node watch mode |
| `npm start` | Start Express without watch mode |
| `npm run seed` | Recreate and seed the SQLite database |

## Database design

### Products

| Field | Description |
| --- | --- |
| `id` | Auto-incrementing primary key |
| `name` | Product name |
| `price` | Non-negative decimal price |
| `created_at` | Creation timestamp |

### Videos

| Field | Description |
| --- | --- |
| `id` | Auto-incrementing primary key |
| `product_id` | Foreign key referencing `Products.id` |
| `video_url` | Video URL |
| `title` | Video title |

### EngagementEvents

| Field | Description |
| --- | --- |
| `id` | Auto-incrementing primary key |
| `video_id` | Foreign key referencing `Videos.id` |
| `event_type` | `view`, `click`, or `add_to_cart` |
| `timestamp` | Event creation timestamp |

Relationships:

- One product has many videos.
- Each video belongs to one product.
- One video has many engagement events.
- Each engagement event belongs to one video.
- Deleting a product cascades to its videos and their events.
- Deleting a video cascades to its engagement events.

Indexes on `Videos.product_id` and `EngagementEvents(video_id, event_type)` support relationship lookups and analytics grouping.

## API documentation

### Health check

```http
GET /api/health
```

Successful response:

```json
{
  "status": "ok"
}
```

### Create an engagement event

```http
POST /api/events
Content-Type: application/json
```

Request body:

```json
{
  "videoId": 1,
  "eventType": "view"
}
```

Successful response: `201 Created`

```json
{
  "id": 121,
  "videoId": 1,
  "eventType": "view",
  "timestamp": "2026-08-27T08:30:00.000Z"
}
```

Validation:

- `videoId` must be a positive integer.
- The referenced video must exist.
- `eventType` must be `view`, `click`, or `add_to_cart`.
- Invalid input returns `400`; a missing video returns `404`.

Example:

```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{"videoId":1,"eventType":"view"}'
```

### Get video analytics

```http
GET /api/analytics/videos?page=1&limit=10
```

Query parameters:

| Parameter | Default | Rules |
| --- | --- | --- |
| `page` | `1` | Positive integer |
| `limit` | `10` | Positive integer, maximum `100` |

Successful response:

```json
{
  "videos": [
    {
      "id": 1,
      "title": "What fits in the Everyday Backpack?",
      "videoUrl": "https://example.com/videos/everyday-backpack.mp4",
      "productId": 1,
      "productName": "Everyday Carry Backpack",
      "productPrice": 89,
      "views": 24,
      "clicks": 8,
      "addToCarts": 4
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

The server paginates video IDs before aggregating events, ensuring page boundaries cannot split a video's metrics. Sequelize performs one engagement join grouped by event type, and videos without events remain in the response with zero counts.

The API does not return conversion rate. React calculates it from the aggregated values:

```text
addToCarts / views * 100
```

When views are zero, the dashboard displays `0.00%`.

## Architecture overview

1. The React client requests a page of analytics through the API service.
2. Express validates query parameters and delegates database work to Sequelize models.
3. SQLite groups engagement events by video and event type.
4. The API reshapes grouped rows into one analytics object per video.
5. React renders the table and calculates conversion rates.
6. Simulate Traffic posts one random allowed event for a video on the current page and refreshes that page in the background.

The design intentionally avoids authentication, queues, caching services, containers, and other infrastructure that is unnecessary for this take-home scope.

## Presentation links

- **YouTube product pitch:** _Add link here_
- **YouTube technical walkthrough:** _Add link here_

## AI usage

Meaningful AI-assisted implementation and review interactions are recorded in [AI_PROMPTING.md](./AI_PROMPTING.md). Routine commands, formatting changes, and minor edits are intentionally excluded.





