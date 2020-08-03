module.exports = app => {
    const controller = {};

    controller.test = (req, resp) => {
        resp.status(200).send("ok!");
    }

    return controller;
}