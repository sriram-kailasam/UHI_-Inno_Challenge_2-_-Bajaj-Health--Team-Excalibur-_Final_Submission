import { Request, Response, Router } from "express";
import { validateRequest } from "../../validateRequest";
import { UhiPayload, uhiPayload } from "../dto/uhiPayload";
import { onMessageDataSchema, OnMessageRequest } from "../dto/onMessage.dto";
import { SocketServer } from "../../sockets";
import { euaConsumerId, gatewayBaseUrl, hspaConsumerId, hspaConsumerUri } from "../../configuration";
import { InitRequest, initSchema } from "./dto/init.dto";
import { saveAppointment, bookGroupConsult } from "../../appointments/appointmentsService";
import dayjs from 'dayjs'
import { SearchRequest, searchRequestSchema } from "./dto/searchRequest.dto";
import { fetchDoctor, getDoctorSlots, searchDoctors } from "../../doctors/doctorsService";
import axios from "axios";
import { Doctor } from "../../doctors/dto/doctor.dto";
import { HspaSearchResult } from "../../eua/dto/hspaSearchResult.dto";
import { Slot } from "../../eua/dto/slot.dto";
import { Appointment } from "../../appointments/dto/appointment.dto";
import { ConfirmRequest, confirmSchema } from "./dto/confirm.dto";
import { runSafe } from "../../util/runSafe";

export function uhiHspaController() {
  const router = Router();

  router.post('/on_message', validateRequest('body', uhiPayload(onMessageDataSchema)), handleOnMessage);
  router.post("/search", validateRequest('body', uhiPayload(searchRequestSchema)), handleSearch)
  router.post('/init', validateRequest('body', uhiPayload(initSchema)), handleInit);
  router.post('/confirm', validateRequest('body', uhiPayload(confirmSchema)), handleConfirm)

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
      const startTime = dayjs(message.intent.fulfillment.start?.time.timestamp);
      const endTime = message.intent.fulfillment.end?.time.timestamp ? dayjs(message.intent.fulfillment.end?.time.timestamp) : startTime.add(1, 'month');

      const [doctor, slots] = await Promise.all([
        fetchDoctor(query),
        getDoctorSlots(query, startTime.toDate(), endTime.toDate())
      ]);

      if (doctor) {
        await runSafe(doctorSlotsCallback(context, doctor, slots));
      } else {
        console.log("Doctor not found for ", query)
      }
    } else {
      const results = await searchDoctors(query)
      if (results?.length) {
        await runSafe(searchDoctorCallback(context, results))
      }
    }
  }

  res.json({ success: true })
}


async function doctorSlotsCallback(context: { consumer_uri: string }, doctor: Doctor, slots: Slot[]) {
  const data: UhiPayload<HspaSearchResult> = {
    context: { ...context, action: 'on_search', consumer_id: hspaConsumerId! },
    message: {
      catalog: {
        fulfillments: slots.map(slot => {
          return {
            id: slot.slotId,
            type: "Teleconsultation",
            tags: {
              "@abdm/gov.in/slot": slot.slotId
            },
            "agent": {
              "id": doctor.hprId,
              "name": doctor.name,
              "gender": doctor.gender,
              "tags": {
                "@abdm/gov/in/first_consultation": String(doctor.fees),
                "@abdm/gov/in/upi_id": doctor.upiId,
                "@abdm/gov/in/follow_up": String(doctor.fees),
                "@abdm/gov/in/experience": String(doctor.experience),
                "@abdm/gov/in/languages": doctor.languages?.join(", "),
                "@abdm/gov/in/speciality": doctor.speciality,
                "@abdm/gov/in/hpr_id": doctor.hprId,
              }
            },
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
      action: 'on_search',
      consumer_id: hspaConsumerId, provider_id: hspaConsumerId, provider_uri: hspaConsumerUri
    }
  };

  console.log({ data: JSON.stringify(data) })

  await axios({
    baseURL: gatewayBaseUrl,
    url: '/on_search',
    method: 'post',
    data
  })
}

async function handleInit(req: Request, res: Response) {
  const { context, message } = req.body as UhiPayload<InitRequest>;

  const { tags } = message.order.fulfillment;
  const isGroupConsult = message.order.fulfillment.tags["@abdm/gov.in/group_consult"] ?? false;

  let appointment: Appointment;

  if (isGroupConsult) {
    appointment = await bookGroupConsult({
      slotId: message.order.fulfillment.id,
      startTime: dayjs(message.order.fulfillment.start.time.timestamp).toISOString(),
      endTime: dayjs(message.order.fulfillment.end.time.timestamp).toISOString(),
      primaryDoctor: {
        hprId: tags["@abdm/gov.in/primary_doctor_hpr_id"]!
      },
      secondaryDoctor: {
        hprId: tags["@abdm/gov.in/secondary_doctor_hpr_id"]!
      },
      patient: {
        abhaAddress: message.order.customer.cred,
        name: message.order.billing.name,
      }
    }
    );
  } else {
    appointment = await saveAppointment({
      isGroupConsult: false,
      hprId: message.order.fulfillment.agent.id,
      slotId: message.order.fulfillment.id,
      startTime: dayjs(message.order.fulfillment.start.time.timestamp).toISOString(),
      endTime: dayjs(message.order.fulfillment.end.time.timestamp).toISOString(),
      doctor: {
        name: message.order.fulfillment.agent.name,
        gender: message.order.fulfillment.agent.gender
      },
      patient: {
        abhaAddress: message.order.customer.cred,
        name: message.order.billing.name,
      }
    });

  }

  runSafe(sendInitCallback({ context, message }));

  res.json({ success: true });
}

async function sendInitCallback({ context, message }: UhiPayload<InitRequest>) {
  const data = {
    "context": { ...context, action: 'on_init', consumer_id: hspaConsumerId },
    "message": message
  }

  await axios({
    baseURL: context.consumer_uri,
    url: "/on_init",
    method: 'POST',
    data: data
  })
}

async function handleConfirm(req: Request, res: Response) {
  const { context, message } = req.body as UhiPayload<ConfirmRequest>;

  await axios({
    baseURL: context.consumer_uri,
    url: "/on_confirm",
    method: "post",
    data: {
      context: {
        ...context, action: "on_confirm", consumer_id: hspaConsumerId
      },
      message
    }
  });

  res.json({ success: true })
}