import {type AppRouter} from 'backend-api'
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>({})