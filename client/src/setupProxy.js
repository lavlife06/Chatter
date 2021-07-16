const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/api/*",
        createProxyMiddleware({
            target: "https://chatter-chatapplication.herokuapp.com/:5000",
        })
    );
};
