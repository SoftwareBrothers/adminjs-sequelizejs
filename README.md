## adminjs-sequelizejs

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [sequelize ORM](http://docs.sequelizejs.com/) into AdminJS.

## Usage

The plugin can be registered using standard `AdminJS.registerAdapter` method.

```javascript
const AdminJS = require('adminjs')
const AdminJSSequelize = require('@adminjs/sequelize')

AdminJS.registerAdapter(AdminJSSequelize)
```

More options can be found on [AdminJS](https://github.com/SoftwareBrothers/adminjs) official website.

## Testing

Integration tests require running database. Database connection data are  given in `config/config.js`. Make sure you have following env variables set: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_HOST. Take a look at `config/config.js` to see default values.


Than you will have to create database and run migrations

```
npm run sequelize db:create
npm run sequelize db:migrate
```

## License

AdminJS is Copyright © 2021 SoftwareBrothers.co. It is free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE) file.

## About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>


We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available to [hire](https://softwarebrothers.co/contact).
* If you want to work for us - checkout the [career page](https://softwarebrothers.co/career).