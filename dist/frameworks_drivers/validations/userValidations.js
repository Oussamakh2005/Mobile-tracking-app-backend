import z from "zod";
const userSchema = z.object({
    email: z.string().email("should be email"),
    username: z.string().min(8, "should be at least 8 characters"),
    password: z.string().min(8, "should be at least 8 characters"),
});
export { userSchema };
