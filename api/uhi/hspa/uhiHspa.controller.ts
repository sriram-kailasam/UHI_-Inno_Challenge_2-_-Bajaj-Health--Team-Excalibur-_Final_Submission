import { Request, Response, Router } from "express";
import { validateRequest } from "../../validateRequest";
import { UhiPayload, uhiPayload } from "../dto/uhiPayload";
import { onMessageDataSchema, OnMessageRequest } from "../dto/onMessage.dto";
import { SocketServer } from "../../sockets";

export function uhiHspaController() {
  const router = Router();

  router.post('/on_message', validateRequest('body', uhiPayload(onMessageDataSchema)), handleOnMessage);
  router.post("/search", handleSearch)

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  const request = req.body as UhiPayload<OnMessageRequest>;

  const message = request.message.intent.chat.content.content_value;
  const receiver = request.message.intent.chat.reciever.person.cred;

  SocketServer.sendTo(receiver, message)

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
          "code": null,
          "symbol": null,
          "images": null,
          "audio": null,
          "render3d": null,
          "short_desc": null,
          "long_desc": null
        },
        "items": [
          {
            "id": "0",
            "descriptor": {
              "name": "Consultation",
              "code": null,
              "symbol": null,
              "images": null,
              "audio": null,
              "render3d": null,
              "short_desc": null,
              "long_desc": null
            },
            "price": {
              "currency": "INR",
              "value": "2.0",
              "breakup": null,
              "estimated_Value": null,
              "computed_Value": null,
              "listed_Value": null,
              "offered_Value": null,
              "minimum_Value": null,
              "maximum_Value": null
            },
            "fulfillment_id": "0"
          }
        ],
        "fulfillments": [
          {
            "id": "0",
            "type": "PhysicalConsultation",
            "state": null,
            "tracking": null,
            "customer": null,
            "agent": {
              "id": "sriram@hpr.abdm",
              "name": "sriram@hpr.abdm - Dr. Sriram Kailasam",
              "image": null,
              "dob": null,
              "gender": "M",
              "cred": null,
              "tags": {
                "@abdm/gov/in/first_consultation": "2.0",
                "@abdm/gov/in/upi_id": "aireshbhat@icici",
                "@abdm/gov/in/follow_up": "1.0",
                "@abdm/gov/in/experience": "15.0",
                "@abdm/gov/in/languages": "English, Hindi, Tamil",
                "@abdm/gov/in/speciality": "Neurologist",
                "@abdm/gov/in/lab_report_consultation": "10.0",
                "@abdm/gov/in/education": "MD Medicine",
                "@abdm/gov/in/hpr_id": "sriram@hpr.abdm",
                "@abdm/gov/in/signature": null
              },
              "phone": null,
              "email": null
            },
            "person": null,
            "contact": null,
            "start": {
              "time": {
                "label": null,
                "timestamp": "T13:26+05:30",
                "duration": null,
                "range": null,
                "days": null,
                "schedule": null
              },
              "instructions": null,
              "contact": null,
              "person": null
            },
            "end": {
              "time": {
                "label": null,
                "timestamp": "T13:26+05:30",
                "duration": null,
                "range": null,
                "days": null,
                "schedule": null
              },
              "instructions": null,
              "contact": null,
              "person": null
            },
            "tags": null,
            "time": null,
            "quote": null,
            "provider_id": null
          }
        ]
      },
      "order_id": null
    },
    "context": {
      "domain": "nic2004:85111",
      "country": "IND",
      "city": "std:080",
      "action": "on_search",
      "timestamp": new Date().toISOString(),
      "key": null,
      "ttl": null,
      "core_version": "0.7.1",
      "consumer_id": "bfhl-EUA",
      "consumer_uri": "https://d3f0-117-99-248-86.in.ngrok.io/api/uhi/eua",
      "provider_id": "http://100.96.9.171:8084/api/v1",
      "provider_uri": "https://d3f0-117-99-248-86.in.ngrok.io/api/uhi/hspa",
      "transaction_id": "ae9e6d90-fde1-11ec-b66a-f551703a8c52",
      "message_id": null
    }
  }
  )
}