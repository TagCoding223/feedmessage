import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { getSession } from "next-auth/react";

export async function DELETE(request:Request, {params}: {params:{messageId:string}}){
    const messageId = await params.messageId;

    await dbConnect()
    const session = await getSession({req: {headers: Object.fromEntries(request.headers)}})
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if (updatedResult.modifiedCount==0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted."
            },{status: 404})
        }

        return Response.json({
            success: true,
            message: "Message Deleted."
        },{status: 200})
    } catch (error) {
        console.error("Error occur in delete a message: ",error);
        return Response.json({
            success: false,
            message: `Error deleting message: ${error}`
        },{status: 500})
    }
}