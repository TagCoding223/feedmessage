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
import { signInSchema } from "@/schemas/signInShema"
import { signIn } from "next-auth/react"



const Page = () => {

    const [isSubmitting, setIsSubmitting] = useState(false)


    const router = useRouter()

    // zod implementation

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const delay = (ms) =>new Promise(res => setTimeout(res,ms))

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        console.log(data)


        // for debugging visit the below urls;
        // http://localhost:3000/api/auth/signin // defualt nextauth sign in page
        // http://localhost:3000/api/auth/callback/credentials // nextauth signin handler
        const response = await signIn('credentials', {
            redirect: false,
            email: data.identifier,
            password: data.password
        })


        if (response?.error) {
            // console.log(response?.error)
            // console.log(response.error.toString())
            //   setToastMessage("Login fail.")
            //   setToastDescription("Incorrect username or password.")
            // toast.error("Login fail.",{description: "Incorrect username or password."})
            

            if(response?.error.toString().slice(0,18) === "User not verified."){
                const username = await response?.error.toString().slice(20,)
                toast.error("Login fail.", { description: "User not verified. Please wait a mintue we redirect you on verification page..." })
                try {
                    setTimeout(()=>{
                        router.replace(`/verify/${username}`)
                        // console.log(`/verify/${username}`)
                    },5000)

                    // another way
                    // await delay(5000);
                    // router.replace(`/verify/${username}`)
                } catch (error) {
                    console.log("Error comes from sign-in page: ",error)
                }
            }else{
                toast.error("Login fail.", { description: response?.error.toString() })
            }
        }



        if (response?.url) {
          router.replace("/dashboard")
        }
        setIsSubmitting(false)
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Feed Message</h1>
                    <p className="mb-4">Sign in to start your anonymous adventure!!!</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">



                        {/* email */}
                        <FormField control={form.control} name="identifier" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} name="identifier" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* password */}
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="password" {...field} name="identifier" />
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
                                ) : ('Signin')
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>Want to create a new Account?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page