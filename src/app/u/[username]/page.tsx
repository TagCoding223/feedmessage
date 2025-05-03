"use client"

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import defaultMessage from '@/data/messages.json'
import axios, { AxiosError } from "axios";
import { AiResponse, ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

const specialChar = '||';

export default function Page() {

  // get username from params
  const params = useParams<{ username: string }>();
  const username = params.username;
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestMessages, setSuggestMessages] = useState<string[]>([])

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('Content');

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    console.log("here:", data)
    const content = data.Content

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: username,
        content: content
      })

      if (response.data.success) {
        toast.success("Success", { description: response.data.message })
      } else {
        toast.warning("Warning", { description: response.data.message })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", { description: axiosError.response?.data.message || "Getting error to send message." })
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleUseMessage = (suggestMessage: string) => {
    console.log(suggestMessage)
    // setSendMessage(suggestMessage)
    // setValue('sendMessage', suggestMessage)
    form.setValue('Content', suggestMessage)
  }

  const fetchSuggestedMessages = async () =>{
    setIsSuggestLoading(true);
    try {
      const response = await axios.get<AiResponse>('/api/suggest-messages');

      if(response.data.success){
        const message = response.data.content
        const aiMessageSuggestion = message.split(specialChar)
        setSuggestMessages(aiMessageSuggestion);
      }else{
        toast.warning("Warning",{description: "Not Found Any Suggestion."})
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", { description: axiosError.response?.data.message || "Getting error to fetch suggest messages." })
    }finally{
      setIsSuggestLoading(false);
    }
  }

  useEffect(() => {
    const defaultMessageSuggestion = defaultMessage.map((value) => {
      return value.content
    })
    setSuggestMessages(defaultMessageSuggestion)

  }, [setSuggestMessages])

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      {/* form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="Content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* suggest message section */}
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            
            {suggestMessages.map((value, index) => (
              <Button variant="outline" className="mb-2" key={index} onClick={() => handleUseMessage(value)}>
                {value}
              </Button>
            ))}

          </CardContent>
        </Card>
      </div>


      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}