import { getSession } from "next-auth/react";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";



export async function POST(request:Request) {
    await dbConnect()

    const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });

    console.log("Special : ", session)
    
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated.",
            request,
            session
        },{status: 401})
    }

    const userId = user._id

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            { new : true}
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed o update user status to accept message."
            },{status: 401})
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully.",
            updatedUser
        },{status: 200})
    } catch (error) {
        console.log("Failed to update user status to accept messages: ",error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },{status: 500})
    }
}

// export async function GET(req:Request) {
//     await dbConnect()
//     // console.log(req.)
//     const session = getServerSession()
//     console.log("Accept Message Session: ",session)
//     const user: User = session?.user as User
//     console.log("Accept Message user: ",user)

//     if (!session || !session.user) {
//         return Response.json({
//             success: false,
//             message: "Not Authenticated.",
//             session,
//             req
//         },{status: 401})
//     }

//     const userId = user._id

//     try {
//         const foundUser = await UserModel.findById(userId)
    
//         if (!foundUser) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "User not found."
//                 }, { status: 404}
//             )
//         }
    
//         return Response.json(
//             {
//                 success: true,
//                 message: "User found.",
//                 isAcceptingMessages: foundUser.isAcceptingMessage
//             }, { status: 200}
//         )
//     } catch (error) {
//         console.log("Failed to update user status to accept messages: ",error)
//         return Response.json({
//             success: false,
//             message: "Error is getting message acceptance status."
//         },{status: 500})
//     }
// }