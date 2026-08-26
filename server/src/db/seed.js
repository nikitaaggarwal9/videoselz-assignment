import database from './database.js';
import { EngagementEvent, Product, Video } from '../models/index.js';

const products = [
  { id: 1, name: 'Everyday Carry Backpack', price: 89.0 },
  { id: 2, name: 'Wireless Noise-Canceling Headphones', price: 149.99 },
  { id: 3, name: 'Insulated Travel Tumbler', price: 34.5 },
  { id: 4, name: 'Adjustable Laptop Stand', price: 59.0 },
];

const videos = [
  {
    id: 1,
    product_id: 1,
    title: 'What fits in the Everyday Backpack?',
    video_url: 'https://example.com/videos/everyday-backpack.mp4',
  },
  {
    id: 2,
    product_id: 1,
    title: 'Backpack commute test',
    video_url: 'https://example.com/videos/backpack-commute.mp4',
  },
  {
    id: 3,
    product_id: 2,
    title: 'Focus mode: headphones demo',
    video_url: 'https://example.com/videos/headphones-demo.mp4',
  },
  {
    id: 4,
    product_id: 3,
    title: 'Keeping coffee hot all morning',
    video_url: 'https://example.com/videos/travel-tumbler.mp4',
  },
  {
    id: 5,
    product_id: 4,
    title: 'A more comfortable desk setup',
    video_url: 'https://example.com/videos/laptop-stand.mp4',
  },
];

const eventCounts = [
  { videoId: 1, view: 24, click: 8, add_to_cart: 4 },
  { videoId: 2, view: 16, click: 5, add_to_cart: 2 },
  { videoId: 3, view: 32, click: 11, add_to_cart: 7 },
  { videoId: 4, view: 8, click: 2, add_to_cart: 1 },
];

function buildEngagementEvents() {
  const events = [];
  const startingTime = Date.parse('2026-08-01T09:00:00.000Z');

  for (const { videoId, ...counts } of eventCounts) {
    for (const [eventType, count] of Object.entries(counts)) {
      for (let index = 0; index < count; index += 1) {
        events.push({
          video_id: videoId,
          event_type: eventType,
          timestamp: new Date(startingTime + events.length * 60_000),
        });
      }
    }
  }

  return events;
}

async function seedDatabase() {
  const engagementEvents = buildEngagementEvents();

  await database.sync({ force: true });

  await database.transaction(async (transaction) => {
    await Product.bulkCreate(products, { transaction, validate: true });
    await Video.bulkCreate(videos, { transaction, validate: true });
    await EngagementEvent.bulkCreate(engagementEvents, {
      transaction,
      validate: true,
    });
  });

  console.log(
    `Seeded ${products.length} products, ${videos.length} videos, and ${engagementEvents.length} engagement events.`,
  );
}

try {
  await seedDatabase();
} catch (error) {
  console.error('Failed to seed database:', error);
  process.exitCode = 1;
} finally {
  await database.close();
}
