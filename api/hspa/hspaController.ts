import { Request, Response, Router } from "express";
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { validateRequest } from "../validateRequest";
import { SendMessageRequest, sendMessageRequestSchema } from "../dto/sendMessage.dto";
import { sendMessage } from "./hspService.external";

export function hspaController() {
  const router = Router()

  router.post('/sendMessage', validateRequest('body', sendMessageRequestSchema), handleSendMessage);

  return router;
}

async function handleSendMessage(req: Request, res: Response) {
  const payload = req.body as SendMessageRequest;

  console.log('sendMessage called', payload)
  try { await sendMessage(payload) } catch (err) {
    console.log(err)
    console.log('response', (err as any)?.response?.data)
  }

  res.json({ success: true })
}