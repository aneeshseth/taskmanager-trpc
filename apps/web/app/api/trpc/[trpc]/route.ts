import { appRouter } from 'backend-api';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import * as trpcExpress from '@trpc/server/adapters/express';
import { prisma } from 'backend-api';
import jwt from 'jsonwebtoken'

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

export default createNextApiHandler({
  router: appRouter,
  createContext,
});


