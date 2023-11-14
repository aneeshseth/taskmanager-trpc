import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express'
import {PrismaClient} from '@prisma/client'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {z} from 'zod'
import * as trpc from '@trpc/server'

export const prisma = new PrismaClient();



const createContext = async (opts?: any) => {
    async function getUserFromHeader() {
        let authHeader = opts?.req.headers["authorization"];
        if (authHeader) {
          const token = authHeader.split(" ")[1];
          return new Promise<{db: {Task: typeof prisma.task, User: typeof prisma.user}, userId: string}>((resolve)=>{
            jwt.verify(token, "ENV_KEY", (err: any, payload: any) => {
              if (payload) {
                  if (typeof payload === "string") {
                      return;
                  }
                  resolve({userId: payload.userId, db: {
                    Task: prisma.task,
                    User: prisma.user
                  }});
              }
              else {
                return {db: {Task: prisma.task, User: prisma.user}, userId: null};
              }
          }) ;
          })
        }
        return {db: {Task: prisma.task, User: prisma.user}, userId: null};
    }
    const user = await getUserFromHeader();
    return {
      user
    };
}

export const tRPCContext = initTRPC.context<Context>().create();
export const middleware = tRPCContext.middleware;





type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const isLoggedIn = middleware(async (opts) => {
  console.log(opts.ctx.user.userId)
  if (!opts.ctx.user.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  } 
  return opts.next()
})

export const isAdmin = middleware(async (opts) => {
  if (opts.ctx.user.userId == null) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  } 
  const id: any = opts.ctx.user.userId;
  const user = await opts.ctx.user.db.User.findFirst({
      where: {
          id: id
      }
  })
  if (user?.admin) {
      return opts.next();
  }
  throw new TRPCError({ code: 'UNAUTHORIZED' });
})
export const publicProcedure = tRPCContext.procedure.use(isLoggedIn);
export const pvtProcedure = tRPCContext.procedure.use(isAdmin)
export const noChecksProdedure = tRPCContext.procedure;
export const userRouter = tRPCContext.router({
  createUser: noChecksProdedure
  .input(z.object({
      username: z.string(),
      password: z.string(), 
  }))
  .mutation(async (opts) => {
    try {
      const existingUser = await opts.ctx.user.db.User.findFirst({
        where: {
          username: opts.input.username
        }
      })
      if (existingUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const newUser = await opts.ctx.user.db.User.create({
         data: {
          username: opts.input.username,
          password: opts.input.password,
          admin: false
         }
      }) 
      const tokenDetails = {
        id: newUser.id,
        username: newUser.username
      }
      const token = await jwt.sign(tokenDetails, "ENV_KEY", {expiresIn: "1d"})
      return {
        newUser, token
      }
    } catch (err) {
      console.log(err)
    }
  }),
  logIn: noChecksProdedure
  .input(z.object({
    username: z.string(),
    password: z.string()
  }))
  .query(async (opts) => {
    try {
      const existingUser = await opts.ctx.user.db.User.findFirst({
        where: {
          username: opts.input.username
        }
      })
      if (!existingUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const checkPassword = existingUser.password === opts.input.password
      if (checkPassword) {
        const tokenDetails = {
          id: existingUser.id,
          username: existingUser.username
        }
        const token = await jwt.sign(tokenDetails, "ENV_KEY", {expiresIn: "1d"})
        return {
          existingUser, token
        }
      }
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    } catch(err) {
      console.log(err)
    }
  }),
  getAdminList: pvtProcedure
  .query(async (opts) => {
    try {
      const allAdmins = opts.ctx.user.db.User.findMany({
        where: {},
      })
      return {
        allAdmins
      }
    } catch (err) {
      console.log(err)
    }
  })
})

const postRouter = tRPCContext.router({
  createTask: publicProcedure
  .input(z.object({
    title: z.string()
  }))
  .mutation(async (opts) => {
    try {
      const id: any = opts.ctx.user.userId
      const taskCreate = await opts.ctx.user.db.Task.create({
        data: {
          task: opts.input.title,
          completed: false,
          authorId: id
        }
      })
      return {
        taskCreate
      }
    } catch(err) {
      console.log(err)
    }
  }),
  markComplete: publicProcedure
  .input(z.object({
    taskId: z.number()
  }))
  .mutation(async (opts) => {
    try {
      const existingTask = await opts.ctx.user.db.Task.findFirst({
        where: {
          id: opts.input.taskId
        }
      })
      if (!existingTask) {
        throw new TRPCError({code: "BAD_REQUEST"})
      }
      const updateTask = await opts.ctx.user.db.Task.update({
        where: {
          id: opts.input.taskId
        },
        data: {
          completed: true
        }
      })
      return {
        updateTask
      }
    } catch (err) {
      console.log(err)
    }
  }),
  getTasks: publicProcedure
  .query(async (opts) => {
    try {
      const id: any = opts.ctx.user.userId;
      console.log(id)
      const findTasks = await opts.ctx.user.db.Task.findMany({
        where: {
          authorId: id
        }
      })
      return {
        findTasks
      }
    } catch (err) {
      console.log(err)
    }
  })
})

export const appRouter = tRPCContext.router({
  user: userRouter,
  post: postRouter
})

const app = express();
app.use(cors())
app.use(
  '/',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    middleware: cors(),
    createContext,
  }),
);


export type AppRouter = typeof appRouter



app.listen(4000, () => {
    console.log("server listening on port 4000")
});


