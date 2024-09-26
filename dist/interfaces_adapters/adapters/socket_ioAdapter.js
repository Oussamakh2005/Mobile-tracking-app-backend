import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class SocketAdapter {
    constructor(socket, redisAdapter) {
        this.socket = socket;
        this.redisAdapter = redisAdapter;
    }
    async auth(token) {
        console.log("auth op started");
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            await this.redisAdapter.set(payload.phoneId, this.socket.id);
            this.socket.emit("authrized", "authrized");
        }
        catch (err) {
            this.socket.emit("unauthrized", "unauthrized");
            this.socket.disconnect();
        }
    }
    async updateLocation(data) {
        const socketId = await this.redisAdapter.get(data.phoneId);
        if (socketId) {
            this.socket.to(socketId).emit('location-update', {
                "latitude": data.latitude,
                "longitude": data.longitude
            });
        }
        else {
            this.socket.disconnect();
        }
    }
}
export default SocketAdapter;
