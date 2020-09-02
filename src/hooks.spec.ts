const db = require('../models/index.js')

after(async () => {
  await db.sequelize.close()
})
