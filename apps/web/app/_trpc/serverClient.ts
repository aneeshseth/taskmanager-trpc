import {appRouter, AppRouter} from 'backend-api'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import {prisma} from 'backend-api'


async function getHeaders(opts: any) {
    console.log(`Bearer ${localStorage.getItem("token") || ""}`)
    return {
        authorization: `Bearer ${localStorage.getItem("token") || ""}` 
    };
}

export const serverClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:4000/',
            headers: getHeaders,
        }),
    ],
    transformer: undefined,
});
