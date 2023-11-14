"use client"
import React, {useState} from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/select";
import {useRouter} from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@ui/components/button";
import './page.css'
import { serverClient } from '../_trpc/serverClient';
function page() {
    const [enterState, setEnterState] = useState<String>("in");
    const [username, setUsername] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const router = useRouter()
    function notifySuccess() {
        toast.success("success.")
    }
    async function signUp() {
        const res = await serverClient.user.createUser.mutate({
            username: username,
            password: accessCode
        })
        localStorage.setItem("token", res!.token)
        notifySuccess()
        router.push("/tasks")
    }
    async function signIn() {
        console.log("shs")
        const res = await serverClient.user.logIn.query({
            username: username,
            password: accessCode
        })
        localStorage.setItem("token", res!.token)
        notifySuccess()
        router.push("/tasks")
    }
    return (
        <div className="flex h-screen text-white" style={{ background: "black", height: "100%", }}>
        <div className="flex">
          <div style={{ marginRight: "120px" }}>
            <img
              src="https://images.unsplash.com/photo-1533112435704-1a4bc513515d?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className='responsive-image'
            />
          </div>
          <div className='responsive-card'>
            {enterState === "in" ? (
              <Card className="max-w-[350px] bg-black mt-4 md:mt-6 mr-10">
                <CardHeader>
                  <CardTitle style={{ color: "white" }}>SignIn</CardTitle>
                  <CardDescription>Please Enter the Relevant details below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname" style={{ color: "white" }}>
                          Username
                        </Label>
                        <Input id="lastname" placeholder="Enter your Username" className="bg-white" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="accessCode" style={{ color: "white" }}>
                          Password
                        </Label>
                        <Input id="accessCode" type="password" placeholder="Enter your Password" className="bg-white" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} autoComplete="off"/>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="text-black border-white" onClick={() => setEnterState("up")}>
                    SignUp?
                  </Button>
                  <Button className="bg-blue-500 hover-bg-blue-700" onClick={signIn}>Done</Button>
                </CardFooter>
              </Card>
            ) : (
                <Card className="max-w-[350px] bg-black mt-4 md:mt-6">
                <CardHeader>
                  <CardTitle style={{ color: "white" }}>SignUp</CardTitle>
                  <CardDescription>Please Enter the Relevant details below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="firstname" style={{ color: "white" }} >
                            Username
                        </Label>
                        <Input id="firstname" placeholder="Enter your First Name" className="bg-white" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname" style={{ color: "white" }}>
                          password
                        </Label>
                        <Input id="lastname" placeholder="Enter your Last Name" className="bg-white" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} autoComplete="off" type="password"/>
                      </div>
                    </div>
                  </form>
                  <div style={{marginTop: "10px"}}>
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="text-black border-white" onClick={() => setEnterState("in")}>
                    SignIn?
                  </Button>
                  <Button className="bg-blue-500 hover-bg-blue-700" onClick={signUp}>Done</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
}

export default page