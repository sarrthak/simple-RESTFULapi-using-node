//read environment variables
require("dotenv").config();

const http = require("http");
const app = require("./app");

const port = process.env.PORT;
console.log("getting port number from .env : " + port);

const server = http.createServer(app);

server.listen(port);

console.log("Server running on http://127.0.0.1:3000");
