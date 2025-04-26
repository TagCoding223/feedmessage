import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken."
                }, { status: 400 }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    messgae: "User already exist with this email."
                },{status: 400})
            }else{
                const hasedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)

                await existingUserByEmail.save();
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save() // save user in db
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if (emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registerd successfully. Please verfiy your email."
        }, {status: 201})
    } catch (error) {
        console.error("Error registering user: ", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user."
            }, {
            status: 500
        }
        )
    }
}

/**
 * Handles the POST request for user registration.
 * 
 * This function connects to the database, validates the user input, checks for
 * existing users by username and email, hashes the password, and either updates
 * an existing unverified user or creates a new user. It also sends a verification
 * email to the user with a verification code.
 * 
 * @param {Request} request - The HTTP request object containing the user registration data.
 * 
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 * 
 * @throws {Error} If there is an issue during the registration process, such as database errors
 * or email sending failures.
 * 
 * ### Workflow:
 * 1. Connects to the database using `dbConnect`.
 * 2. Parses the request body to extract `username`, `email`, and `password`.
 * 3. Checks if a verified user with the same username exists:
 *    - If yes, returns a 400 response with an error message.
 * 4. Checks if a user with the same email exists:
 *    - If the user is verified, returns a 400 response with an error message.
 *    - If the user is unverified, updates the user's password, verification code, and expiry.
 * 5. If no user exists with the email, creates a new user with the provided details.
 * 6. Sends a verification email to the user:
 *    - If email sending fails, returns a 500 response with an error message.
 * 7. Returns a 201 response indicating successful registration and prompts the user to verify their email.
 */