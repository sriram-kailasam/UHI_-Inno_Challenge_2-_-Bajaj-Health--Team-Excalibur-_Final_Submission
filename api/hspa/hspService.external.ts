import { SendMessageRequest } from "../dto/sendMessage.dto";
import axios from "axios"
import { v4 as uuid } from 'uuid'
import { getCache } from "../cache";

const cache = getCache();

export async function sendMessage(payload: SendMessageRequest) {
  const promises: Promise<unknown>[] = []

  payload.receiverId.forEach(receiverId => {
    const baseUrl = cache.get<string>(`providerUri:${receiverId}`);

    if (!baseUrl) {
      console.log(`baseUrl not found for ${receiverId}`);
      return;
    }

    promises.push((async () => {
      try {
        await axios({
          baseURL: baseUrl,
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
              "consumer_uri": baseUrl,
              "provider_id": process.env.HSPA_CONSUMER_ID,
              "provider_uri": process.env.HSPA_CONSUMER_URI,
              "message_id": "b86fe6c3-bdb3-4969-95ab-d183bb950115",
              "timestamp": new Date().toISOString(),
              "transaction_id": "4433dd66-4c46-4514-a448-58322ae7f80d"
            },
            "message": {
              "intent": {
                "chat": {
                  "sender": {
                    "person": {
                      "cred": payload.senderId
                    }
                  },
                  "receiver": {
                    "person": {
                      "cred": receiverId
                    }
                  },
                  "content": {
                    "content_id": payload.content.id,
                    "content_value": JSON.stringify(payload),
                    "content_type": "video_call_signalling"
                  },
                  "time": {
                    "timestamp": payload.timestamp
                  }
                }
              }
            }
          }
        });

        console.log('on_message sent for ', receiverId)
      } catch (err) {
        console.log('on_message error for ', receiverId, err)
      }
    })())
  }
  )

  await Promise.allSettled(promises)
}