var http = require("http");

http.createServer((req, res) => {
    console.log('Request => ', req);    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello Vincent's World!`);

}).listen(8081);

console.log('Server running http://localhost:8081/');
