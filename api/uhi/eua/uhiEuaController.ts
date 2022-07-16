import { Request, Response, Router } from "express";
import { getCache } from "../../cache";
import { GatewayOnSearchRequest } from "./dto/gatewayOnSearch.dto";

const cache = getCache();

export function uhiEuaController() {
  const router = Router()

  router.post('/on_message', handleOnMessage)
  router.post('/on_search', handleOnSearch)

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  res.json({ success: true })
}

async function handleOnSearch(req: Request, res: Response) {
  const resultMessage = req.body as GatewayOnSearchRequest;

  const transactionId = resultMessage.context.transaction_id;
  console.log("search result received", transactionId)
  if (transactionId) {
    cache.set(`gatewaySearch:${transactionId}`, resultMessage);
    res.json({ success: true })
  } else {
    console.log('no fulfillments found')
    res.json({ success: false })
  }
}