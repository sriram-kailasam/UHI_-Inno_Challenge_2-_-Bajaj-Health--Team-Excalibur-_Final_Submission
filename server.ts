import 'source-map-support';
import 'express-async-errors';
import './dayjsimports'
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import path from "path"
import serveIndex from 'serve-index'
import bodyParser from "body-parser"
import httpLogger from "pino-http"
import 'dotenv/config'
import { uhiHspaController } from "./api/uhi/hspa/uhiHspa.controller"
import { createServer } from 'http'
import { SocketServer } from "./api/sockets"
import { hspaController } from "./api/hspa/hspaController"
import { uhiEuaController } from "./api/uhi/eua/uhiEuaController"
import { euaController } from './api/eua/euaController';
var isBetween = require('dayjs/plugin/isBetween')


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


app.use('/api/hspa', hspaController())
app.use('/api/eua', euaController())

app.use('/api/uhi/eua', uhiEuaController())
app.use('/api/uhi/hspa', uhiHspaController());

app.get('/eua/*', function (_, res) {
  res.sendFile(euaDir + '/index.html');
})

app.get('/hspa/*', function (_, res) {
  res.sendFile(hspaDir + '/index.html');
});

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  console.log('stack', error.stack)

  if (error.isAxiosError) {
    console.log('axios error response', error?.response?.data)
  }

  const status = 500;
  res.status(status).json({ error: error.message });
})

const httpServer = createServer(app)
SocketServer.init(httpServer)

httpServer.listen(process.env.PORT, () => console.log("listening"))
