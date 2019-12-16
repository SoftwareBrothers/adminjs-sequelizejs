module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
  }, {})
  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Post
}
