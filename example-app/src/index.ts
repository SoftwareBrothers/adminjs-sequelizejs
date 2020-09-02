/* eslint-disable import/first */
import path from 'path'
import { config } from 'dotenv'

config({ path: path.join(__dirname, '../../.env') })

import express from 'express'
import AdminBro from 'admin-bro'
import { buildRouter } from '@admin-bro/express'
import AdminBroSequelize from '@admin-bro/sequelize'

import userAdmin from './users/user.admin'

import connect from './connect'

const PORT = 3000

AdminBro.registerAdapter(AdminBroSequelize)
const run = async () => {
  const sequelize = await connect()
  const app = express()
  const admin = new AdminBro({
    databases: [sequelize],
    resources: [{
      resource: sequelize.models.User,
      options: userAdmin,
    }],
  })

  admin.watch()

  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()
