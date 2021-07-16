const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/api/*",
        createProxyMiddleware({
            target: "https://pacific-crag-66308.herokuapp.com/:5000",
        })
    );
};
