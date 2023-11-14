"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { serverClient } from '../_trpc/serverClient';
import { prisma } from 'backend-api';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@ui/components/table"
function page() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any>([])
  async function fetchData() {
    const res = await serverClient.post.getTasks.query()
    console.log(res)
    console.log(res?.findTasks.length)
    setTasks(res!.findTasks);
  }
  useEffect(() => {
    !localStorage.getItem("token") ? router.push("/"):fetchData()
  }, [])
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "black" }}>
      <Table style={{ width: "100%" }}>
        <TableCaption style={{ fontSize: "20px" }}>A list of your recent tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]" style={{fontSize: "25px"}}>TaskID</TableHead>
            <TableHead className="text-center" style={{fontSize: "25px"}}>Task</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium" style={{ color: "white", fontSize: "17px" }}>INV{task.id}</TableCell>
              <TableCell className="text-center" style={{ color: "white", fontSize: "17px" }}>{task.task}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
  
}

export default page

