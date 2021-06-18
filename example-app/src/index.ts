/* eslint-disable import/first */
import path from 'path'
import { config } from 'dotenv'

config({ path: path.join(__dirname, '../../.env') })

import express from 'express'
import AdminJS from 'adminjs'
import { buildRouter } from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'

import userAdmin from './users/user.admin'

import connect from './connect'

const PORT = 3000

AdminJS.registerAdapter(AdminJSSequelize)
const run = async () => {
  const sequelize = await connect()
  const app = express()
  const admin = new AdminJS({
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
