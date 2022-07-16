import { Request, Response, Router } from "express";
import { validateRequest } from "../../validateRequest";
import { UhiPayload, uhiPayload } from "../dto/uhiPayload";
import { onMessageDataSchema, OnMessageRequest } from "../dto/onMessage.dto";
import { SocketServer } from "../../sockets";
import { hspaConsumerId, hspaConsumerUri } from "../../configuration";
import { InitRequest, initSchema } from "./dto/init.dto";
import { saveAppointment } from "../../appointments/appointmentsService";
import dayjs from 'dayjs'

export function uhiHspaController() {
  const router = Router();

  router.post('/on_message', validateRequest('body', uhiPayload(onMessageDataSchema)), handleOnMessage);
  router.post("/search", handleSearch)
  router.post('/init', validateRequest('body', uhiPayload(initSchema)), handleInit)

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  const request = req.body as UhiPayload<OnMessageRequest>;

  const message = request.message.intent.chat.content.content_value;
  const receiver = request.message.intent.chat.reciever.person.cred;

  SocketServer.sendTo([receiver], message)

  res.json({ success: true })
}

function handleSearch(req: Request, res: Response) {
  res.json({
    "message": {
      "intent": null,
      "order": null,
      "catalog": {
        "descriptor": {
          "name": "HSPA",

        },
        "items": [
          {
            "id": "0",
            "descriptor": {
              "name": "Consultation",

            },
            "price": {
              "currency": "INR",
              "value": "2.0",

            },
            "fulfillment_id": "0"
          }
        ],
        "fulfillments": [
          {
            "id": "0",
            "type": "PhysicalConsultation",

            "agent": {
              "id": "sriram@hpr.abdm",
              "name": "sriram@hpr.abdm - Dr. Sriram Kailasam",

              "gender": "M",
              "cred": null,
              "tags": {
                "@abdm/gov/in/first_consultation": "2.0",
                "@abdm/gov/in/follow_up": "1.0",
                "@abdm/gov/in/experience": "15.0",
                "@abdm/gov/in/languages": "English, Hindi, Tamil",
                "@abdm/gov/in/speciality": "Neurologist",
                "@abdm/gov/in/education": "MD Medicine",
                "@abdm/gov/in/hpr_id": "sriram@hpr.abdm",
              },
            },
            "start": {
              "time": {
                "timestamp": "T13:26+05:30",

              },

            },
            "end": {
              "time": {
                "timestamp": "T13:26+05:30",

              },

            },

          }
        ]
      },
    },
    "context": {
      "domain": "nic2004:85111",
      "country": "IND",
      "city": "std:080",
      "action": "on_search",
      "timestamp": new Date().toISOString(),
      "consumer_id": "bfhl-EUA",
      "consumer_uri": "https://d3f0-117-99-248-86.in.ngrok.io/api/uhi/eua",
      "provider_id": hspaConsumerId,
      "provider_uri": hspaConsumerUri,
      "transaction_id": "ae9e6d90-fde1-11ec-b66a-f551703a8c52",
    }
  }
  )
}

async function handleInit(req: Request, res: Response) {
  const { message } = req.body as UhiPayload<InitRequest>;

  saveAppointment({
    hprId: message.order.fulfillment.agent.id,
    slotId: message.order.fulfillment.id,
    startTime: dayjs(message.order.fulfillment.start.time.timestamp).toISOString(),
    endTime: dayjs(message.order.fulfillment.end.time.timestamp).toISOString(),
    isGroupConsult: false,
    doctor: {
      name: message.order.fulfillment.agent.name,
      gender: message.order.fulfillment.agent.gender
    },
    patient: {
      abhaAddress: message.order.customer.cred,
      name: message.order.billing.name,
    }
  })

  res.json({ success: true })
}