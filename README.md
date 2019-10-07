## admin-bro-typeorm

This is an inofficial [AdminBro](https://github.com/SoftwareBrothers/admin-bro) adapter which integrates [TypeORM](https://typeorm.io/) into admin-bro.

## Usage

The plugin can be registered using standard `AdminBro.registerAdapter` method.

```javascript
import { Database, Resource } from "admin-bro-typeorm";
const AdminBro = require('admin-bro');

AdminBro.registerAdapter({ Database, Resource });
```