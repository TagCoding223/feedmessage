import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({

            name: 'Credentials',

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const email = req.body?.email
                const password = req.body?.password

                const res = await fetch(`${process.env.BASE_URL}api/getUserByEmail`, {
                    method: "POST",
                    body: JSON.stringify({
                        "email": email
                    })
                })

                //TODO: ALSO CHECK USER IS VERIFY OR NOT

                const user = await res.json()

                console.log(user.user)
                if (user.user === null) {
                    throw new Error("User not exist.")
                    // return Response.json({
                    //         success: false,
                    //         message: "User not exist."
                    //     }, { status: 404 })
                }

                if (user) {


                    const isPasswordCorrect = await bcrypt.compare(password, user.user?.password.toString());
                    console.log(isPasswordCorrect)
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect Credentials.")
                        // return Response.json({
                        //     success: false,
                        //     message: "Incorrect Credentials."
                        // }, { status: 401 }) // 401 UNAUTHORIZED 

                    }

                    
                    if (!user.user?.isVerified) {
                        // console.log("Verify username: ",user.user?.username)
                        throw new Error(`User not verified.||${user.user?.username}`)
                        // return Response.json({
                        //         success: false,
                        //         message: "User not verified."
                        //     }, { status: 401 }) // 404 not found
                    }
                }

                if (res.ok && user) {
                    return user.user
                } else {
                    // return Response.json({
                    //     success: false,
                    //     message: "User not found."
                    // }, { status: 404 }) // 404 not found
                    throw new Error("User not found.")
                }
            }
        })

    ],
    session: {
        strategy: "jwt"
    },
    // secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("In callback username: ", user.username)
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.name = user.username;
            }
            // console.log("Token : ",token)
            return token
        },
        async session({ session, token }) {
            if (token) {
                // Fetch the latest user data from the database
                // const user = await UserModel.findById(token._id);

                // if (user) {
                //     session.user._id = token._id?.toString();
                //     session.user.isVerified = user?.isVerified;
                //     session.user.isAcceptingMessages = user?.isAcceptingMessages; // Dynamically fetch this field
                //     session.user.username = user?.username;
                // } else {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.name = token.name;
                // }

            }
            // console.log("Session : ", session)
            return session
        }
    }
})

export { handler as GET, handler as POST }