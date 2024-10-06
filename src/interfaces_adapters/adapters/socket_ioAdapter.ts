import { Socket } from "socket.io";
import RedisAdapter from "./redisAdapter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class SocketAdapter {

    constructor(
        private socket: Socket,
        private redisAdapter: RedisAdapter
    ) { }
    async auth(token: string) {
        console.log("auth op started");
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string, phoneId: string };
            await this.redisAdapter.set(payload.phoneId, this.socket.id);
            this.socket.emit("authrized", "authrized");
        } catch (err) {
            this.socket.emit("unauthrized", "unauthrized");
            this.socket.disconnect();
        }
    }
    async updateLocation(data: { latitude: string, longitude: string, phoneId: string }) {
        const socketId: string | null = await this.redisAdapter.get(data.phoneId);
        if (socketId) {
            this.socket.to(socketId as string).emit('location-update', {
                "latitude": data.latitude,
                "longitude": data.longitude
            });
        }else{
            this.socket.disconnect();
        }
    }
}

export default SocketAdapter;