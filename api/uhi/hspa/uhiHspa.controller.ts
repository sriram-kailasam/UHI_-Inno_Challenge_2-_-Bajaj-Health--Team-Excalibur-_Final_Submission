import { Request, Response, Router } from "express";
import { validateRequest } from "../../validateRequest";
import { UhiPayload, uhiPayload } from "../dto/uhiPayload";
import { onMessageDataSchema, OnMessageRequest } from "../dto/onMessage.dto";
import { SocketServer } from "../../sockets";
import { euaConsumerId, gatewayBaseUrl, hspaConsumerId, hspaConsumerUri } from "../../configuration";
import { InitRequest, initSchema } from "./dto/init.dto";
import { saveAppointment } from "../../appointments/appointmentsService";
import dayjs from 'dayjs'
import { SearchRequest, searchRequestSchema } from "./dto/searchRequest.dto";
import { getDoctorSlots, searchDoctors } from "../../doctors/doctorsService";
import axios from "axios";
import { Doctor } from "../../doctors/dto/doctor.dto";
import { HspaSearchResult } from "../../eua/dto/hspaSearchResult.dto";
import { Slot } from "../../eua/dto/slot.dto";

export function uhiHspaController() {
  const router = Router();

  router.post('/on_message', validateRequest('body', uhiPayload(onMessageDataSchema)), handleOnMessage);
  router.post("/search", validateRequest('body', uhiPayload(searchRequestSchema)), handleSearch)
  router.post('/init', validateRequest('body', uhiPayload(initSchema)), handleInit);

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  const request = req.body as UhiPayload<OnMessageRequest>;

  const message = request.message.intent.chat.content.content_value;
  const receiver = request.message.intent.chat.reciever.person.cred;

  SocketServer.sendTo([receiver], message)

  res.json({ success: true })
}

async function handleSearch(req: Request, res: Response) {
  const { message, context } = req.body as UhiPayload<SearchRequest>;

  const query = message.intent.fulfillment.agent.name || message.intent.fulfillment.agent.cred;


  if (query) {
    if (context.provider_uri) {
      const slots = await getDoctorSlots(query);
      await doctorSlotsCallback(context, slots);
    } else {
      const results = await searchDoctors(query)
      if (results?.length) {
        await searchDoctorCallback(context, results)
      }
    }
  }

  res.json({ success: true })
}


async function doctorSlotsCallback(context: { consumer_uri: string }, results: Slot[]) {
  const data: UhiPayload<HspaSearchResult> = {
    context: { ...context, consumer_uri: hspaConsumerUri!, consumer_id: hspaConsumerId! },
    message: {
      catalog: {
        fulfillments: results.map(slot => {
          return {
            id: slot.slotId,
            start: {
              time: { timestamp: slot.startTime }
            },
            end: { time: { timestamp: slot.endTime } }
          }
        })
      }
    }
  }

  await axios({
    baseURL: context.consumer_uri,
    url: '/on_search',
    method: "post",
    data: data
  })
}

async function searchDoctorCallback(context: { consumer_uri: string }, results: Doctor[]) {
  const data = {
    "message": {
      "catalog": {
        "descriptor": {
          "name": "HSPA"
        },
        "items": results.map((doctor, index) => {
          return {
            "id": String(index),
            "descriptor": {
              "name": "Consultation"
            },
            "price": {
              "currency": "INR",
              "value": String(doctor.fees)
            },
            "fulfillment_id": String(index)
          }
        }),
        "fulfillments": results.map((doctor, index) => {
          return {
            "id": String(index),
            "type": "TeleConsultation",
            "agent": {
              "id": doctor.hprId,
              "name": doctor.name,
              "gender": doctor.gender,
              "tags": {
                "@abdm/gov/in/first_consultation": String(doctor.fees),
                "@abdm/gov/in/experience": String(doctor.experience),
                "@abdm/gov/in/languages": doctor.languages.join(','),
                "@abdm/gov/in/speciality": doctor.speciality,
                "@abdm/gov/in/hpr_id": doctor.hprId,
              }
            },
          }
        })
      },
      "order_id": null
    },
    "context": {
      ...context,
      consumer_id: hspaConsumerId, consumer_uri: hspaConsumerUri, provider_id: hspaConsumerId, provider_uri: hspaConsumerUri
    }
  }

  console.log({ data: JSON.stringify(data) })

  await axios({
    baseURL: gatewayBaseUrl,
    url: '/on_search',
    method: 'post',
    data
  })
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