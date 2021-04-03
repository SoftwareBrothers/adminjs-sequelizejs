module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
  }, {})
  return Comment
}
