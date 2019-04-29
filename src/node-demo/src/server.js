var express = require("express");
var app = express();

app.get('/', (req, res, next) => {
    console.log('Request => ', req);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello Vincent's World!`);
});

app.set("port", process.env.PORT || 8081);

app.listen(app.get("port"), () => {
    console.log(`  App is running at http://localhost:${app.get("port")} mode`);
    console.log("  Press CTRL-C to stop\n");
});