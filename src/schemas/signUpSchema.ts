import {z} from 'zod'

// below syntax use to validate only one thing
export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters.")
    .max(20,"Must be no more than 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character.")

// z.object use because we apply validation on multiple things
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be at least 6 chatacter."}).max(16, {message: "Must be no more than 16 characters."})
})