import mongoose, { Schema, Document } from "mongoose";
// import { Content } from "next/font/google";

/**
 * Interface representing a message document in the database.
 * @extends Document - Mongoose document interface.
 */
export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date
}

/**
 * Mongoose schema for the Message model.
 * Provides type safety for the Message interface.
 */
const MessageSchema: Schema<Message> = new Schema({ // Message interface give here type safety nothing extra
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

/**
 * Interface representing a user document in the database.
 * @extends Document - Mongoose document interface.
 */
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}

/**
 * Mongoose schema for the User model.
 * Defines the structure and validation rules for user documents.
 */
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address."]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    verifyCode: {
        type: String,
        required: [true, "Veriy code is required."]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required."]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    /**
     * The list of messages associated with the user.
     * Uses the MessageSchema for validation.
     */
    messages: [MessageSchema]
})


/**
 * Mongoose model for the User schema.
 * Ensures that the model is not recompiled if it already exists.
 */
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;


// documentation

/**
 * Represents a message in the system.
 * 
 * @interface Message
 * @extends {Document}
 * @property {string} content - The content of the message.
 * @property {Date} createdAt - The date and time when the message was created.
 */
 
/**
 * Schema definition for the `Message` model.
 * Provides type safety for the `Message` interface.
 */

/**
 * Represents a user in the system.
 * 
 * @interface User
 * @extends {Document}
 * @property {string} username - The unique username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} verifyCode - The verification code sent to the user.
 * @property {Date} verifyCodeExpiry - The expiration date and time of the verification code.
 * @property {boolean} isVerified - Indicates whether the user's email is verified.
 * @property {boolean} isAcceptingMessage - Indicates whether the user is accepting messages.
 * @property {Message[]} messages - A list of messages associated with the user.
 */

/**
 * Schema definition for the `User` model.
 * Provides type safety for the `User` interface.
 * 
 * - `username`: Must be unique, trimmed, and is required.
 * - `email`: Must be unique, match a valid email format, and is required.
 * - `password`: Required field for storing the user's hashed password.
 * - `verifyCode`: Required field for storing the user's verification code.
 * - `verifyCodeExpiry`: Required field for storing the expiration of the verification code.
 * - `isVerified`: Defaults to `false`, indicates if the user is verified.
 * - `isAcceptingMessage`: Defaults to `true`, indicates if the user is open to receiving messages.
 * - `messages`: An array of messages associated with the user.
 */

/**
 * The `UserModel` is a Mongoose model for interacting with the `User` collection in the database.
 * It uses the `UserSchema` to enforce structure and validation.
 * 
 * @constant
 * @type {mongoose.Model<User>}
 */