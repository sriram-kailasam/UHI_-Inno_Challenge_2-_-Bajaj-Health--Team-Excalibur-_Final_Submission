import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from "express"
import cors from "cors"
import path from "path"
import serveIndex from 'serve-index'

export const appRouter = trpc
  .router()
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

const euaDir = path.join(__dirname, '..', 'eua-client', 'build')
const hspaDir = path.join(__dirname, '..', 'hspa-client', 'build')

app.use('/eua', express.static(euaDir), serveIndex('eua'))
app.use('/hspa', express.static(hspaDir), serveIndex('hspa'))

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(5000, () => console.log("listening"))

export type AppRouter = typeof appRouter;