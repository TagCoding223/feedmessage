/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"



const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastDescription, setToastDescription] = useState('')
    const debounced = useDebounceCallback(setUsername, 1000) // reduce server request (deny server request on each key press)


    const router = useRouter()

    // zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
            email: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    console.log(response)
                    // const message = response.data.message
                    // setUsernameMessage(message)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        console.log(data)
        try {
            const response = await axios.post('/api/sign-up', data)
            setToastMessage(`Success: ${response.data.message}`)
            setToastDescription(new Date().toString())
            router.replace(`/verfiy/${username}`)
        } catch (error) {
            console.error("Error in signup of user: ", error);
            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage = axiosError.response?.data.message ?? ""
            setToastMessage("Signup failed")
            setToastDescription(errorMessage)

            // toast.message("Signup failed",{
            //     description: errorMessage,
            // })

            // toast.warning("Signup failed",{
            //     description: errorMessage
            // })

        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Feed Message</h1>
                    <p className="mb-4">Sign up to start your anonymous adventure!!!</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* username */}
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} onChange={(e) => {
                                        field.onChange(e)
                                        debounced(e.target.value)
                                    }} />
                                </FormControl>
                                {
                                    isCheckingUsername && <Loader2 className="animate-spin" />
                                }
                                <p className={`text-sm ${usernameMessage === "Username is unique." ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* email */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* password */}
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : ('Signup')
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page