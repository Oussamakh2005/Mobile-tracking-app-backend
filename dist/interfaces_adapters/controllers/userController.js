import { v4 as uuidv4 } from 'uuid';
import { userSchema } from "../../frameworks_drivers/validations/userValidations.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async singUp(req, res) {
        try {
            const validatedData = userSchema.parse(req.body);
            const phoneId = uuidv4();
            validatedData.password = hashSync(validatedData.password, 10);
            try {
                await this.userService.createUser({ ...validatedData, phoneId });
                return res.status(201).json({
                    ok: true,
                    msg: "user created"
                });
            }
            catch (err) {
                return res.status(500).json({
                    ok: false,
                    msg: "somthing went wrong"
                });
            }
        }
        catch (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
        }
    }
    async singIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.findByEmail(email);
            if (user && compareSync(password, user.password)) {
                if (req.query.machine === "phone") {
                    return res.status(200).json({
                        ok: true,
                        data: user.phoneId
                    });
                }
                const token = jwt.sign({ userId: user.id, phoneId: user.phoneId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
                return res.status(200).json({
                    ok: true,
                    data: token
                });
            }
            else {
                return res.status(404).json({
                    ok: false,
                    msg: "user not found"
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                ok: false,
                msg: "somthing went wrong"
            });
        }
    }
}
export default UserController;
