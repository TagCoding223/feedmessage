/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Description } from "@radix-ui/react-alert-dialog"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { getSession, useSession } from "next-auth/react"
import { describe } from "node:test"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function dashboard() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const { data: session, update } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessage')

    // Get status of isAcceptingMessage field from db
    const fetchStatusOfAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        console.debug("Accept Messages: ", acceptMessages)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')

            // console.log(response)
            if (response.status) {
                setValue("acceptMessage", response.data.isAcceptingMessages || false)
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.warning("Error", { description: axiosError.response?.data.message || "Failed to fetch message settings" })
            // console.log(axiosError)
            // toast.warning("Error", { description: "Unique Failed to fetch message settings" })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue, acceptMessages])

    // toggle isAcceptingMessage field in db
    // handle switch button change
    const updateStatusOfAcceptMessage = async () => {

        // console.log("I'm here special")
        // console.log(acceptMessages)
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })

            // for debugging
            {
                // const response = await fetch('/api/accept-messages', {
                //     method: "POST",
                //     body: JSON.stringify({
                //         "acceptMessages": !acceptMessages
                //     })
                // })
                // const currentStatus = await response.json()
                // console.log("Updated User unique : ",currentStatus)
                // setValue('acceptMessage', currentStatus.isAcceptingMessages)
                // toast.info("Field Updated",{description: currentStatus.message})
            }

            if (response) {
                // console.log("Updated User unique : ",response.data)
                setValue('acceptMessage', response.data.isAcceptingMessages || false)
                toast.info("Field Updated", { description: response.data.message })

                // update session
                // console.log("Previous session: ", session)
                // await update({...session,isAcceptingMessages: response.data.isAcceptingMessages})
                // if (session) {
                //     await update({ ...session, user: { ...session.user, isAcceptingMessages: response.data.isAcceptingMessages } });
                // }
                // const updatedSession = await getSession() // now i get updated session
                // console.log("Updated session: ", updatedSession)
            } else {
                toast.warning("Field Updated Fail.", { description: "Fail to update accept message status." })
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.warning("Error", { description: axiosError.response?.data.message || "Failed to Update Field to Accept Messages." })
        }
    }

    let profileUrl = '';
    if (typeof window !== "undefined") {
        profileUrl = `${window.location.protocol}//${window.location.host}/u/${session?.user.name}`
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("Copy")
    }

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.info("Refreshed Messages", { description: "Showing lastest messages." })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.warning("Error", { description: axiosError.response?.data.message || "Failed to fetch messages" })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }

    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) { return }
        fetchMessages()
        fetchStatusOfAcceptMessage()
    }, [session, setValue, fetchStatusOfAcceptMessage,fetchMessages])


    if (!session || !session.user) {
        return <div>Please login</div>
    }


    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-fit lg:w-xl max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input type="text" name="" id="" value={profileUrl} disabled className="input input-borderd w-full p-2 mr-2" />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>

                <div className="mb-4">
                    <Switch {...register('acceptMessage')}
                        checked={acceptMessages}
                        onClick={updateStatusOfAcceptMessage}
                        // onCheckedChange={updateStatusOfAcceptMessage}
                        disabled={isSwitchLoading} />
                    <span className="ml-2">
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </div>
                <Separator />

                <Button
                    className="mt-4"
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages();
                    }}
                >
                    {
                        isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )
                    }
                </Button>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <p>No messages to display.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default dashboard