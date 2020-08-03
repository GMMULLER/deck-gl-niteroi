module.exports = app => {
    app.get('/', (req, resp) => {
        resp.sendFile("map.html",{
            root: "./src/public",
        });
    });
}