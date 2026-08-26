import { Router } from 'express';
import { EVENT_TYPES } from '../models/EngagementEvent.js';
import { EngagementEvent, Video } from '../models/index.js';

const router = Router();

router.post('/', async (request, response, next) => {
  const { videoId, eventType } = request.body ?? {};

  if (!Number.isInteger(videoId) || videoId <= 0) {
    return response.status(400).json({
      error: 'videoId must be a positive integer.',
    });
  }

  if (!EVENT_TYPES.includes(eventType)) {
    return response.status(400).json({
      error: `eventType must be one of: ${EVENT_TYPES.join(', ')}.`,
    });
  }

  try {
    const video = await Video.findByPk(videoId, { attributes: ['id'] });

    if (!video) {
      return response.status(404).json({ error: 'Video not found.' });
    }

    const event = await EngagementEvent.create({
      video_id: videoId,
      event_type: eventType,
    });

    return response.status(201).json({
      id: event.id,
      videoId: event.video_id,
      eventType: event.event_type,
      timestamp: event.timestamp,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;

