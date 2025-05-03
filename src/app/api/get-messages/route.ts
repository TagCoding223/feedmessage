import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { getSession } from "next-auth/react";


export async function GET(request:Request){
    await dbConnect()

    const session = await getSession({req: {headers: Object.fromEntries(request.headers)}});

    const user: User = session?.user as User;

    // console.log("Get Message: ",user, session)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated."
        },{status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id); // id in string type they make issue with aggrigation than convet it into mongoose ObjectId (this issue not occur at time of find by id and with other find by methods)

    
    try {
        const messages = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        console.log("Messages: ",messages)

        if (!messages || messages.length===0) {
            return Response.json({
                success: false,
                message: "Message not found."
            },{status: 401})
        }

        return Response.json({
            success: true,
            messages: messages[0].messages
        },{status: 200})
    } catch (error) {
        console.error("Something get wrong in find user messages: ",error);
        return Response.json({
            success: false,
            message: "Something is wrong in getting user messages."
        },{status: 401})
    }
}
