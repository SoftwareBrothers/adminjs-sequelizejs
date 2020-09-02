import { DataTypes, Sequelize } from 'sequelize'

const build = (sequelize: Sequelize) => {
  const Comment = sequelize.define('Comment', {
    // Model attributes are defined here
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {
    // Other model options go here
  })

  return Comment
}

export default build
