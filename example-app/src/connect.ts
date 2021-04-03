/* eslint-disable no-console */
import { Sequelize } from 'sequelize'
import buildUser from './users/user.entity'
import buildComment from './comments/comment.entity'

const connect = async (): Promise<Sequelize> => {
  const dbName = process.env.POSTGRES_DATABASE || 'adminbro-sequelize'
  const host = process.env.POSTGRES_HOST || 'localhost'
  const password = process.env.POSTGRES_PASSWORD || 'adminbro'
  const user = process.env.POSTGRES_USER || 'adminbro'
  const port = process.env.POSTGRES_PORT || 5432

  const sequelize = new Sequelize(
    `postgres://${user}:${password}@${host}:${port}/${dbName}`,
  )

  const User = buildUser(sequelize)
  const Comment = buildComment(sequelize)

  User.hasMany(Comment, { foreignKey: 'userId' })
  Comment.belongsTo(User, { foreignKey: 'userId' })

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  if (!process.env.SKIP_SYNC) {
    await sequelize.sync({ force: true })
  }
  return sequelize
}

export default connect
