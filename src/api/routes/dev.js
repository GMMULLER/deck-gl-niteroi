module.exports = app => {
    const controller = app.api.controllers.dev;
    app.route('/api/dev/ping')
        .get(controller.ping);
}