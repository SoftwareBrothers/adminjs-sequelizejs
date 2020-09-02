/* eslint-disable import/first */
import path from 'path'
import { config } from 'dotenv'

config({ path: path.join(__dirname, '../../.env') })

import express from 'express'
import AdminBro from 'admin-bro'
import { buildRouter } from '@admin-bro/express'
import AdminBroSequelize from '@admin-bro/sequelize'

import connect from './connect'

const PORT = 3000

AdminBro.registerAdapter(AdminBroSequelize)
const run = async () => {
  const sequelize = await connect()
  const app = express()
  const admin = new AdminBro({
    databases: [sequelize],
    resources: [

    ],
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
