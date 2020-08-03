module.exports = app => {
    const controller = {};

    controller.ping = (req, resp) => {
        resp.status(200).send("ok!");
    }

    return controller;
}