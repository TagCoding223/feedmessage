import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: Request) {
    console.log("error")
    const pathName = new URL(request.url).pathname;
    const username = pathName.slice(16,)

    console.log("here username ", username);
    dbConnect();

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const isUpdate = await UserModel.updateOne({ username: username },{$set: {
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate
    }});

    console.log(isUpdate);
    if (!isUpdate || isUpdate.matchedCount === 0) {
        return Response.json({
            success: false,
            message: "User not exist."
        }, { status: 404 });
    }

    const user = await UserModel.findOne({username: username})
    if(user){
        const emailResponse = await sendVerificationEmail(user?.email,user?.username,user?.verifyCode);

        console.log(emailResponse)
        if(emailResponse.success){
            return Response.json({
                success: false,
                message: "Failed to send verification code."
            }, { status: 200 });
        }
    }

    return Response.json({
        success: true,
        message: "Verification Code valid for 1 hour."
    }, { status: 200 });
}