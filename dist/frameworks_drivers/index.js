import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import SocketAdapter from "../interfaces_adapters/adapters/socket_ioAdapter.js";
import RedisAdapter from "../interfaces_adapters/adapters/redisAdapter.js";
import redisClient from "./singeltons/redisClient.js";
import mainRouter from "../interfaces_adapters/routers/index.js";
//import path from "path";
//import { fileURLToPath } from "url";
//setup dotenv:
dotenv.config();
//setup express server :
const app = express();
//setup http server:
const server = http.createServer(app);
//set express json middleware:
app.use(express.json());
//set router :
app.use('/api', mainRouter);
//
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//app.use(express.static(path.join(__dirname, '../../public')));
//setup socket.io server:
const io = new Server(server);
//config socket.io server:
io.on("connection", (socket) => {
    console.log("a user connected");
    //create socket adapter :
    const socketAdapter = new SocketAdapter(socket, new RedisAdapter(redisClient));
    //auth :
    socket.on("auth", (token) => {
        socketAdapter.auth(token);
    });
    //update position :
    socket.on("location-update", (data) => {
        socketAdapter.updateLocation(data);
    });
    //disconnect :
    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
});
//make http server listen to port :
server.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
