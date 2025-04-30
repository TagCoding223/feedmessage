import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"

export async function POST(req:Request){
    const {email} = await req.json()
    
    dbConnect()
    try {     
        const user = await UserModel.findOne({email: email})
        if(user){
            return Response.json({
                success: true,
                messgae: "User exist.",
                user
            },{status: 200})
        }else{
            return Response.json({
                success: false,
                messgae: "User not exist.",
                user
            },{status: 404})
            // throw new Error("User not exist.")
        }
    } catch (error) {
        // throw new Error("Got Error im finding user: ")
        return Response.json({
            success: false,
            messgae: error
        },{status: 500})
    }
}