import { Router } from 'express';
import { col, fn, Op } from 'sequelize';
import { EngagementEvent, Product, Video } from '../models/index.js';

const router = Router();
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const metricByEventType = {
  view: 'views',
  click: 'clicks',
  add_to_cart: 'addToCarts',
};

function parsePositiveInteger(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  if (Array.isArray(value) || !/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : null;
}

router.get('/videos', async (request, response, next) => {
  const page = parsePositiveInteger(request.query.page, DEFAULT_PAGE);
  const limit = parsePositiveInteger(request.query.limit, DEFAULT_LIMIT);

  if (page === null) {
    return response.status(400).json({
      error: 'page must be a positive integer.',
    });
  }

  if (limit === null || limit > MAX_LIMIT) {
    return response.status(400).json({
      error: `limit must be a positive integer no greater than ${MAX_LIMIT}.`,
    });
  }

  const offset = (page - 1) * limit;

  if (!Number.isSafeInteger(offset)) {
    return response.status(400).json({ error: 'page is too large.' });
  }

  try {
    const [totalItems, pageVideos] = await Promise.all([
      Video.count(),
      Video.findAll({
        attributes: ['id'],
        order: [['id', 'ASC']],
        limit,
        offset,
        raw: true,
      }),
    ]);
    const videoIds = pageVideos.map((video) => video.id);

    const results =
      videoIds.length === 0
        ? []
        : await Video.findAll({
            attributes: ['id', 'title', ['video_url', 'videoUrl']],
            where: { id: { [Op.in]: videoIds } },
            include: [
              {
                model: Product,
                attributes: ['id', 'name', 'price'],
                required: true,
              },
              {
                model: EngagementEvent,
                attributes: [
                  ['event_type', 'eventType'],
                  [fn('COUNT', col('EngagementEvents.id')), 'count'],
                ],
                required: false,
              },
            ],
            group: ['Video.id', 'Product.id', 'EngagementEvents.event_type'],
            order: [['id', 'ASC']],
            raw: true,
            nest: true,
          });

    const videosById = new Map();

    for (const result of results) {
      if (!videosById.has(result.id)) {
        videosById.set(result.id, {
          id: result.id,
          title: result.title,
          videoUrl: result.videoUrl,
          productId: result.Product.id,
          productName: result.Product.name,
          productPrice: result.Product.price,
          views: 0,
          clicks: 0,
          addToCarts: 0,
        });
      }

      const video = videosById.get(result.id);
      const metric = metricByEventType[result.EngagementEvents.eventType];

      if (metric) {
        video[metric] = result.EngagementEvents.count;
      }
    }

    const videos = [...videosById.values()];
    const totalPages = Math.ceil(totalItems / limit);

    return response.json({
      videos,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
