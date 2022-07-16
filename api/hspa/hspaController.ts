import { Request, Response, Router } from "express";
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { validateRequest } from "../validateRequest";
import { SendMessageRequest, sendMessageRequestSchema } from "../dto/sendMessage.dto";

export function hspaController() {
  const router = Router()

  router.post('/sendMessage', validateRequest('body', sendMessageRequestSchema), handleSendMessage);

  return router;
}

async function handleSendMessage(req: Request, res: Response) {
  const payload = req.body as SendMessageRequest;

  try {
    await axios({
      baseURL: process.env.EUA_CONSUMER_URI,
      url: '/on_message',
      method: 'post',
      data:
      {
        "context": {
          "domain": "nic2004:85111",
          "country": "IND",
          "city": "std:080",
          "action": "message",
          "core_version": "0.7.1",
          "consumer_id": process.env.HSPA_CONSUMER_ID,
          "consumer_uri": process.env.HSPA_CONSUMER_URI,
          "message_id": uuid(),
          "timestamp": new Date().toISOString(),
          "transaction_id": uuid()
        },
        "message": {
          "intent": {
            "chat": {
              "sender": {
                "person": {
                  "cred": payload.senderId
                }
              },
              "reciever": {
                "person": {
                  "cred": payload.receiverId
                }
              },
              "content": {
                "content_id": payload.content.id,
                "content_value": payload.content.value
              },
              "time": {
                "timestamp": payload.timestamp
              }
            }
          }
        }
      }
    })
  } catch (err) {
    console.log((err as any).response.data)
  }

  res.json({ success: true })
}