import express from "express"
import cors from "cors"
import path from "path"
import serveIndex from 'serve-index'
import httpLogger from "pino-http"
import 'dotenv/config'


const app = express()
app.use(cors())

const euaDir = path.join(__dirname, '..', 'eua-client', 'build')
const hspaDir = path.join(__dirname, '..', 'hspa-client', 'build')

app.use('/eua', express.static(euaDir), serveIndex('eua'))
app.use('/hspa', express.static(hspaDir), serveIndex('hspa'))

app.use(httpLogger({
  serializers: {
    req(req) {
      req.body = req.raw.body;
      return req;
    },
  },
}))

app.listen(process.env.PORT, () => console.log("listening"))
