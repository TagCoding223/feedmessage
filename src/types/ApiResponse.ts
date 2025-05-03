import { Message } from "@/models/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}

export interface AiResponse{
    success: boolean;
    content: string;
}