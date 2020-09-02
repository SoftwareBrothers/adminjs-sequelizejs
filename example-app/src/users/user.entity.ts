import { DataTypes, Sequelize } from 'sequelize'

const build = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
  // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    // allowNull defaults to true
    },
    email: {
      type: DataTypes.STRING,
    // allowNull defaults to true
    },
  }, {
  // Other model options go here
  })

  return User
}

export default build
