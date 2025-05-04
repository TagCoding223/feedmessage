"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useCountdown } from 'usehooks-ts'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import { toast } from 'sonner'

// TODO: MAKE IMPROVEMENT
function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const [toastMessage, setToastMessage] = useState('')
    const [toastDescription, setToastDescription] = useState('')
    const [countingBegin, setCountingBegin] = useState(false)
    const [remainTime,setRemainTime] = useState('')
    const [intervalValue, setIntervalValue] = useState<number>(1000) // use to change count value after each 1sec
    const sec = 9;
    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: sec*10,
      intervalMs: intervalValue,
    })



    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues:{
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success("Success",{description: response.data.message})
            router.push('/sign-in')
        } catch (error) {
            console.error("Error in verify code: ", error);
            const axiosError = error as AxiosError<ApiResponse>
            setToastMessage("Verification failed!")
            toast.warning("Verification failed!", {description: axiosError.response?.data.message || "Something is wrong."})
        }
    }

    const resendOTP = async () =>{
        setCountingBegin(true)
        
        try {
            console.log("Pizza: ",params.username)
            const username = params.username
            // send verification email
            const response = await axios.get<ApiResponse>(`/api/resend-otp/${username}`)
            console.log(response.data.success)
            if(response.data.success){
                toast.success("Send On Your Email.",{description: response.data.message})
                startCountdown()
                setTimeout(()=>{
                    resetCountdown()
                    setCountingBegin(false)
                },(sec*10000))
            }else{
                toast.warning("Error",{description: response.data.message})
            }
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError)
            toast.warning("Error",{description: axiosError.response?.data.message || "Getting error will send Verification code."})
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                    <p className="mb-4">Enter the Verification code send to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-3">

                        {/* code */}
                        <FormField control={form.control} name="code" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field}/>
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type='submit'>Submit</Button>
                    </form>
                </Form>
                <div>
                    <Button disabled={countingBegin} onClick={resendOTP}>
                    {!countingBegin?"Resend OTP":<span>{`Resend OTP After: ${count}s`}</span>}
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default VerifyAccount