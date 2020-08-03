const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const cors = require('cors');

module.exports = () => { //Making this function public for the application
    const app = express();

    //Application environment variables
    app.set('port', process.env.PORT || config.get('server.port'));

    //Setting up middlewares
    app.use(bodyParser.json()); //Allows JSON auto parse and encode
    app.use(cors());
    app.use(express.static("./src/public")) //Allow node.js to serve static pages

    //Loading routing components
    consign({cwd: 'src'})
        .then('api')
        .into(app);
    
    return app;
};