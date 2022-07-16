import express from "express"
import cors from "cors"
import path from "path"
import serveIndex from 'serve-index'
import bodyParser from "body-parser"
import httpLogger from "pino-http"
import 'dotenv/config'
import { uhiHspaController } from "./api/uhi/hspa/uhiHspa.controller"

const app = express()
app.use(cors())

const euaDir = path.join(__dirname, '..', 'eua-client', 'build')
const hspaDir = path.join(__dirname, '..', 'hspa-client', 'build')

app.use('/eua', express.static(euaDir), serveIndex('eua'))
app.use('/hspa', express.static(hspaDir), serveIndex('hspa'))

app.use(bodyParser.json())
app.use(httpLogger({
  serializers: {
    req(req) {
      req.body = req.raw.body;
      return req;
    },
  },
}))

app.get('/api/hspa', uhiHspaController());

app.get('/eua/*', function (_, res) {
  res.sendFile(euaDir + '/index.html');
})

app.get('/hspa/*', function (_, res) {
  res.sendFile(hspaDir + '/index.html');
});

app.listen(process.env.PORT, () => console.log("listening"))
