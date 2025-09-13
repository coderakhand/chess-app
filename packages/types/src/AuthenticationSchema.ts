import z from "zod";

const emailSchema = z.email();
const usernameSchema = z.string().min(4).max(20);
const passwordSchema = z.string().min(6).max(20);


export { emailSchema, usernameSchema, passwordSchema };
