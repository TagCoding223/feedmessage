import { getSession } from "next-auth/react";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()

    console.log("Message Accept Post call.")

    const body =await request.json()
    // console.log("Req: ",body) 
    const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } }); // request document hold headers section with cookiw and this cookie hold all client side tokens like next-auth.csrf-token, next-auth.csrf-url, and next-auth.session-token that hold several information(doesn't need to pass session explicitly in reqest body from clent side), this statement extract information from session

    // console.log("Special queen : ", session)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated."
        }, { status: 401 })
    }

    const userId = user._id

    const  acceptMessages  = body.acceptMessages

    // console.log("Acceptmessage from client: ",acceptMessages)

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        console.log("Updated User: ",updatedUser)

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message."
            }, { status: 401 })
            // throw new Error("Failed to update user status to accept message.")
        }

        
        // session.user.isAcceptingMessages = updatedUser.isAcceptingMessages this is not work first need to chnage in token ans second thing to remember the session is avaliable on client side than we need to update session at client side
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully.",
            isAcceptingMessages: updatedUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages: ", error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()
    console.log(request)
    const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });
    // console.log("Accept Message Session: ",session)
    const user: User = session?.user as User
    // console.log("Accept Message user: ",user)

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated."
        }, { status: 401 })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found."
            }, { status: 404 }
            )
        }

        console.log("User: ",foundUser)

        return Response.json({
            success: true,
            message: "User found.",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages: ", error)
        return Response.json({
            success: false,
            message: "Error is getting message acceptance status."
        }, { status: 500 })
    }
}