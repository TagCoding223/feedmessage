import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated."
        },{status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id); // id in string type they make issue with aggrigation than convet it into mongoose ObjectId (this issue not occur at time of find by id and with other find by methods)

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if (!user || user.length===0) {
            return Response.json({
                success: false,
                message: "User not found."
            },{status: 401})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        },{status: 200})
    } catch (error) {
        console.error("Something get wrong in find user: ",error);
        return Response.json({
            success: false,
            message: "Something is wrong in getting user."
        },{status: 401})
    }
}
