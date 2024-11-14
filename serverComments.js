// server.js
// Express library -- web application framework for Node.js that simplifies the process of building web servers and applications.
// http module from Node.js allows to create HTTP servers.
// Socket.IO library for real-time, (2-way) communication between web clients and servers.

const express = require("express"); // importing the Express library
const http = require("http"); // importing the built-in http module fr Node.js.
const socketIo = require("socket.io"); // imports the Socket.IO library,
const app = express(); // creates an instance of the Express application, which you will use to define your routes and middleware.

const server = http.createServer(app); // creating an HTTP server that uses the Express app to handle incoming requests.
const io = socketIo(server); // initializes a new instance of Socket.IO by passing the HTTP server you just created, allowing you to set up WebSocket connections for real-time communication.

app.use(express.static("public")); // serve static files from public directory; This line tells the Express app to serve static files (like HTML, CSS, and JavaScript) from the public directory. Any files in this folder can be accessed directly from the web.

io.on("connection", (socket) => {
  console.log("a user connected");
  //   This line sets up an event listener for new client connections. When a client connects to the Socket.IO server, it will execute the callback function with the socket parameter, representing the connected client. Inside the connection event listener, this line logs a message to the console that a user has connected to the server.

  socket.on("makeMove", (data) => {
    // This sets up an event listener for a "makeMove" event, which listens for moves made by the clients. When a client makes a move, the server receives the data about that move.

    io.emit("moveMade", data); // broadcast move to all clients; Inside the makeMove event listener, this line emits a "moveMade" event to all connected clients, broadcasting the move data received from the original client. This allows all players to see the move in real-time.
  });

  socket.on("disconnect", () => {
    // This line sets up an event listener for when a client disconnects from the server.

    console.log("user disconnected");
    //     When a user disconnects, this line logs a message to the console that the user has disconnected.
  });
});
// This closes the disconnect event listener.
const PORT = process.env.PORT || 3000;
// This line defines the port number on which the application will listen for incoming requests. It first checks if a PORT is defined in the environment variables; if not, it defaults to port 3000.
server.listen(PORT, () => {
  //   console.log(Server is running on http://localhost:${PORT});This line starts the server, making it listen for incoming requests on the defined PORT.
  console.log("Server is running on http://localhost:3000");
});
// Finally, this line logs a message to the console indicating that the server is up and running at http://localhost:3000.

// NOTEBOOK (1) express()
// express() -- function provided by the Express framework for Node.js that creates an Express application that is an instance of the Express module and is used to define server behavior, including routing, middleware, handling requests and responses, and serving static files.

// Routing: defining routes for your application: specifying how to handle different HTTP requests (like GET, POST, PUT, DELETE) at various endpoints.
//    app.get('/example', (req, res) => {
//       res.send('Hello, World!');
//    });

// Middleware: use middleware functions to process requests before they reach your route handlers. Middleware can perform tasks like logging, authentication, parsing request bodies, etc.
//    app.use(express.json()); // A built-in middleware to parse JSON bodies

// Serving Static Files (like HTML, CSS, and JavaScript) directly from a specified directory.
//    app.use(express.static('public')); // serves files in the 'public' directory

// Configuring Application Settings for your application, such as setting the view engine for rendering HTML templates.
//    app.set('view engine', 'ejs'); // for rendering EJS templates

// Handling Requests and Responses: With the application instance, you can handle incoming requests and send responses back to the client.
// const express = require('express');
// const app = express(); // Create an Express application instance
// app.get('/', (req, res) => {
//     res.send('Hello, Express!'); // Send a response when the root URL is accessed
// });
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(Server is running on http://localhost:${PORT});
// });

// NOTEBOOK:  (2) http.createServer(app)
// a Node.js function that creates an HTTP server and associates it with the Express application instance (app), allows the server to handle incoming HTTP requests and delegate them to the Express application for processing.

// createServer() method of the http module. When http.createServer() is called, it initializes a new HTTP server instance.

// by Passing the Express App (which is an instance of your Express application) as an argument to createServer(), you allow the server to use the middleware, routes, and other configurations that you have defined in your Express application.

// Request Handling: When a request comes to the server, it will call the appropriate route handler or middleware defined in the Express app. The Express app will then process the request and send a response back to the client.

// const express = require('express');
// const http = require('http');
// const app = express(); // Create an Express applicationttp Module: The http module is a built-in Node.js module that provides utilities for creating HTTP servers and clients. It's part of Node.js's core functionality and allows you to work with HTTP protocol.

// Define a route:
// app.get('/', (req, res) => {
//     res.send('Hello, world!'); // Respond with a message
// });

// Create an HTTP server and associate it with the Express app:
// const server = http.createServer(app);

// Listen on a specific port for incoming connections:
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(Server is running on http://localhost:${PORT});
// });

// An Express application (app) is created.
// A route is defined to respond to GET requests to the root URL.
// An HTTP server is created using http.createServer(app): any HTTP request sent to this server will go through the Express app for routing and response handling.
// the server listens on port 3000, and you can access the application via http://localhost:3000.

// NOTEBOOK: (3) SOCKET.IO
// const io = socketIo(server) -- to initialize a new instance of Socket.IO on the HTTP server you've created.

// Socket.IO: a JavaScript library that enables real-time, bidirectional communication between clients (browsers) and a server.

// Initialization: When you call socketIo(server), you are creating a new Socket.IO instance that is tied to the specified server. This means that the Socket.IO server can listen for incoming WebSocket connections on that HTTP server.

// WebSocket Communication: The io variable now represents the Socket.IO server instance. Using this instance, you can set up event listeners, emit events, and manage connections for clients that use Socket.IO to connect.

// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server); // Initialize Socket.IO on the server

// // Listen for client connections
// io.on("connection", (socket) => {
//     console.log("A user connected");
//     // Listen for custom events from the client
//     socket.on("someEvent", (data) => {
//         console.log("Received data from client:", data);
//         // Emit events back to the client or other clients
//         socket.emit("responseEvent", { message: "Hello from server!" });
//     });

//     // Handle client disconnection
//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(Server is running on http://localhost:${PORT});
// });

// Connection Listener: The io.on("connection", (socket) => {...}) line listens for new connections from clients. When a client connects, a new socket instance is created for that specific client.

// Emitting and Listening Events: Inside the connection event, you can listen for custom events (like someEvent in the example) emitted from the client and handle them. You can also emit events back to the client.

// Disconnect Handling: You can listen for the disconnect event to take action when a client disconnects, such as logging a message.

// const io = socketIo(server); connects HTTP server and Socket.IO framework for real-time communication
