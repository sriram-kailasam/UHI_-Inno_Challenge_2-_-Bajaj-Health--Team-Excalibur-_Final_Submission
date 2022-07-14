import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from "express"
import cors from "cors"

export const appRouter = trpc
  .router()
  // Create procedure at path 'hello'
  .query('hello', {
    resolve({ ctx }) {
      return {
        greeting: `hello world`,
        something: "else"
      };
    },
  });

const app = express()
app.use(cors())
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,

  })
);

app.listen(5000, () => console.log("listening"))

export type AppRouter = typeof appRouter;