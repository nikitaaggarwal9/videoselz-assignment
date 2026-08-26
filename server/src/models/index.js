import database from '../db/database.js';
import defineEngagementEvent from './EngagementEvent.js';
import defineProduct from './Product.js';
import defineVideo from './Video.js';

export const Product = defineProduct(database);
export const Video = defineVideo(database);
export const EngagementEvent = defineEngagementEvent(database);

Product.hasMany(Video, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
Video.belongsTo(Product, { foreignKey: 'product_id' });

Video.hasMany(EngagementEvent, {
  foreignKey: 'video_id',
  onDelete: 'CASCADE',
});
EngagementEvent.belongsTo(Video, { foreignKey: 'video_id' });

export async function initializeDatabase() {
  await database.authenticate();
  await database.sync();
}

