## adminjs-sequelizejs

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [sequelize ORM](http://docs.sequelizejs.com/) into AdminJS.

## Usage

The plugin can be registered using standard `AdminJS.registerAdapter` method.

```javascript
const AdminJS = require('adminjs')
const AdminJSSequelize = require('@adminjs/sequelize')

AdminJS.registerAdapter(AdminJSSequelize)
```

More options can be found in [AdminJS](https://github.com/SoftwareBrothers/adminjs) repository.

## Testing

Integration tests require running database. Database connection data are  given in `config/config.js`. Make sure you have following env variables set: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_HOST. Take a look at `config/config.js` to see default values.


Than you will have to create database and run migrations

```
npm run sequelize db:create
npm run sequelize db:migrate
```

## License

AdminJS is copyrighted © 2023 rst.software. It is a free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About rst.software

<img src="https://pbs.twimg.com/profile_images/1367119173604810752/dKVlj1YY_400x400.jpg" width=150>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://www.rst.software/estimate-your-project).
* If you want to work for us - check out the [career page](https://www.rst.software/join-us).
