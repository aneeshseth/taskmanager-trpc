"use client"
import * as React from "react";
import { Button } from "@ui/components/button";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  function enterPage() {
    router.push("/enter");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
        <img src="https://png.pngtree.com/png-vector/20221029/ourmid/pngtree-aesthetic-note-paper-png-image_6402174.png" alt="Logo" className="mb-4" />
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mt-4 md:mt-6 lg:mt-10 text-center"
          style={{
            backgroundImage: 'linear-gradient(to right, #e70ab0, #f2b1d2)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            margin: "10px"
          }}
        >
          Manage all your tasks at one destination.
        </h1>
        <h3 className="text-gray-500 text-center mb-8 md:mb-12 lg:mb-16">© Task Manager</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-screen-lg mt-4 mx-auto">
          <div className="box mb-4 sm:mb-0 mr-5">
            <Button style={{ fontSize: "1rem" }} onClick={enterPage}>Enter Application</Button>
          </div>
        </div>
      </div>
    </>
  );
}