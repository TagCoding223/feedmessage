import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found."
            },{status: 404})
        }

        // is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages."
            },{status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message) // push a new message with giving sureity that we pass object of message type
        await user.save()

        return Response.json({
            success: true,
            message: "Message send successfully."
        },{status: 200})
    } catch (error) {
        console.error("Error adding messages: ",error);
        return Response.json({
            success: false,
            message: "Error adding messages by internal server error."
        },{status: 500})
    }
}