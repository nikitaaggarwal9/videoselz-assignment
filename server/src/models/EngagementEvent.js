import { DataTypes } from 'sequelize';

export const EVENT_TYPES = ['view', 'click', 'add_to_cart'];

export default function defineEngagementEvent(database) {
  return database.define(
    'EngagementEvent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_type: {
        type: DataTypes.ENUM(...EVENT_TYPES),
        allowNull: false,
        validate: { isIn: [EVENT_TYPES] },
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'EngagementEvents',
      timestamps: false,
      indexes: [{ fields: ['video_id', 'event_type'] }],
    },
  );
}
