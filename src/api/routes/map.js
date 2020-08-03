module.exports = app => {
    //const controller = app.api.controllers.test;
    //app.route('/api/test')
     //   .get(controller.test);

    app.get('/', (req, resp) => {
        resp.sendFile("map.html",{
            root: "./src/public",
        });
    });
}