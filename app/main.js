//http module
var http = require('http');

//Create server
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello Chris!\n");
});

//Start server
server.listen(8080);
console.log("Hello Chris: Server listening on http://127.0.0.1:8080/");
