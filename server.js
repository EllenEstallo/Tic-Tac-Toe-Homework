const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();

const server = http.createServer(app); // creating an HTTP server that uses
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("makeMove", (data) => {
    io.emit("moveMade", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
