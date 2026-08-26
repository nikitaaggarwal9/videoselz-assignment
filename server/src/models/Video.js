import { DataTypes } from 'sequelize';

export default function defineVideo(database) {
  return database.define(
    'Video',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      video_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Videos',
      timestamps: false,
      indexes: [{ fields: ['product_id'] }],
    },
  );
}

