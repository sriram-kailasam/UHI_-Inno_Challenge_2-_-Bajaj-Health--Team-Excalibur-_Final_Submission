import { Request, Response, Router } from "express";
import { getCache } from "../../cache";
import { SocketServer } from "../../sockets";
import { validateRequest } from "../../validateRequest";
import { onMessageDataSchema, OnMessageRequest } from "../dto/onMessage.dto";
import { uhiPayload, UhiPayload } from "../dto/uhiPayload";
import { GatewayOnSearchRequest, gatewayOnSearchRequestSchema } from "./dto/gatewayOnSearch.dto";
import { z } from 'zod'
import { HspaSearchResult, hspaSearchResultSchema } from "../../eua/dto/hspaSearchResult.dto";
const cache = getCache();

export function uhiEuaController() {
  const router = Router()

  router.post('/on_message', validateRequest('body', uhiPayload(onMessageDataSchema)), handleOnMessage)
  router.post('/on_search', validateRequest('body', z.union([gatewayOnSearchRequestSchema, uhiPayload(hspaSearchResultSchema)])), handleOnSearch)

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  const request = req.body as UhiPayload<OnMessageRequest>;

  console.log('received message', request.message.intent.chat)
  const message = request.message.intent.chat.content.content_value;
  const receiver = request.message.intent.chat.reciever.person.cred;

  SocketServer.sendTo([receiver], message)

  res.json({ success: true })
}

async function handleOnSearch(req: Request, res: Response) {
  const resultMessage = req.body as GatewayOnSearchRequest | UhiPayload<HspaSearchResult>;

  const transactionId = resultMessage.context.transaction_id;
  console.log("search result received", transactionId)
  const key = `gatewaySearch:${transactionId}`;
  if (transactionId) {

    const results = cache.get<GatewayOnSearchRequest[]>(key) || []
    console.log("existing results", JSON.stringify(results))
    cache.set(key, [...results, resultMessage]);

    res.json({ success: true })
  } else {
    console.log('no fulfillments found')
    res.json({ success: false })
  }
}