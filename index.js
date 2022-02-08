const express = require('express');

const { PORT } = require('./config/index.js');
const expressConfig = require('./config/express.js');
const databaseConfig = require('./config/database.js');

const homeController = require('./controllers/homeController.js');
const hotelController = require('./controllers/hotelController.js');
const userController = require('./controllers/userController.js');

start();
async function start() {
    const app = express();

    expressConfig(app);
    await databaseConfig(app);

    app.use(userController);
    app.use(homeController);
    app.use(hotelController);

    app.listen(PORT, () => {
        console.log(`Server is listening on port: http://localhost:${PORT}`);
    });
}

