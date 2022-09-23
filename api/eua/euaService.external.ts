import axios from "axios"
import { waitForData } from "../util/waitForData"
import { v4 as uuid } from 'uuid'
import { SearchResult } from "./dto/searchResult.dto";
import { GatewayOnSearchRequest } from "../uhi/eua/dto/gatewayOnSearch.dto";
import { defaultHspaBaseUrl, euaConsumerId, euaConsumerUri, } from "../configuration";
import { getCache } from "../cache";
import { HspaSearchResult } from "./dto/hspaSearchResult.dto";
import dayjs from 'dayjs'
import { UhiPayload } from "../uhi/dto/uhiPayload";
import { SaveAppointmentRequest } from "../appointments/dto/saveAppointment.dto";
import { Slot } from "./dto/slot.dto";

const cache = getCache();

export async function searchDoctors(name: string): Promise<SearchResult[]> {
  const transactionId = await sendSearchDoctorsRequest(name);
  try {
    const results = await waitForData<GatewayOnSearchRequest[]>(`gatewaySearch:${transactionId}`, 1000, 5)
    let searchResults: SearchResult[] = [];

    results.forEach(result => {
      console.log({ catalog: JSON.stringify(result.message.catalog) })
      searchResults = searchResults.concat(result.message.catalog.fulfillments?.map(fulfillment => {
        const hprId = fulfillment.agent.id;
        cache.set(`providerUri:${hprId}`, result.context.provider_uri)
        cache.set(`providerId:${hprId}`, result.context.provider_id)

        return {
          hprId: hprId,
          name: fulfillment.agent.name,
          education: fulfillment.agent.tags?.['@abdm/gov/in/education'],
          experience: Number(fulfillment.agent.tags?.["@abdm/gov/in/experience"]),
          fees: Number(fulfillment.agent.tags?.["@abdm/gov/in/first_consultation"]),
          gender: fulfillment.agent.gender,
          imageUri: fulfillment.agent.image,
          speciality: fulfillment.agent.tags?.["@abdm/gov/in/speciality"],
          languages: fulfillment.agent.tags?.["@abdm/gov/in/languages"]?.split(',')
        }
      }))


    })
    return searchResults
  } catch {
    return []
  }
}

async function sendSearchDoctorsRequest(name: string) {
  const transactionId = uuid();

  console.log("sending search request");
  const data = {
    "context": {
      "domain": "nic2004:85111",
      "country": "IND",
      "city": "std:080",
      "action": "search",
      "timestamp": new Date().toISOString(),
      "core_version": "0.7.1",
      "consumer_id": euaConsumerId,
      "consumer_uri": euaConsumerUri,
      "transaction_id": transactionId,
      "message_id": uuid()
    },
    "message": {
      "intent": {
        "fulfillment": {
          "agent": {
            "name": name
          },
          "type": "TeleConsultation",
          "start": {
            "time": {
              "timestamp": dayjs().subtract(1, 'month').toISOString()
            }
          },
          "end": {
            "time": {
              "timestamp": dayjs().add(1, 'month').toISOString()
            }
          },
        }
      }
    }
  };

  console.log({ searchData: JSON.stringify(data) })
  const response = await axios({
    baseURL: process.env.GATEWAY_BASE_URL,
    url: 'search',
    method: 'post',
    data
  })

  console.log('search request sent', response.data)

  return transactionId;
}


export async function getSlots(hprId: string): Promise<Slot[]> {
  const transactionId = await sendGetSlotsRequest(hprId)

  const result = await waitForData<UhiPayload<HspaSearchResult>[]>(`gatewaySearch:${transactionId}`);

  console.log({ result: JSON.stringify(result) })
  return result[0]?.message.catalog.fulfillments?.map((fulfillment: any) => {
    console.log({ fulfillment: JSON.stringify(fulfillment) })
    return {
      slotId: fulfillment.id,
      startTime: dayjs(fulfillment.start.time.timestamp).toISOString(),
      endTime: dayjs(fulfillment.end.time.timestamp).toISOString()
    }
  })

}

async function sendGetSlotsRequest(hprId: string) {
  const transactionId = uuid()

  const providerUri = cache.get<string>(`providerUri:${hprId}`);
  const providerId = cache.get<string>(`providerId:${hprId}`);

  const data = {
    "context": {
      "domain": "nic2004:85111",
      "country": "IND",
      "city": "std:080",
      "action": "search",
      "timestamp": new Date().toISOString(),
      "core_version": "0.7.1",
      "consumer_id": euaConsumerId,
      "consumer_uri": euaConsumerUri,
      "transaction_id": transactionId,
      "provider_id": providerId,
      "provider_uri": providerUri,
      "message_id": uuid()
    },
    "message": {
      "intent": {
        "fulfillment": {
          "agent": {
            cred: hprId
          },
          "start": {
            "time": {
              "timestamp": dayjs().toISOString()
            }
          },
          "end": {
            "time": {
              "timestamp": dayjs().add(1, 'week').toISOString()
            }
          },
          "type": "TeleConsultation"
        }
      }
    }
  };

  console.log({ slotsData: JSON.stringify(data) })


  await axios({
    baseURL: providerUri || defaultHspaBaseUrl,
    url: "/search",
    method: 'post',
    data
  })


  return transactionId
}

export async function initAppointment(request: SaveAppointmentRequest) {
  const providerUri = cache.get<string>(`providerUri:${request.hprId}`);

  await axios({
    baseURL: providerUri || defaultHspaBaseUrl,
    url: '/init',
    method: 'post',
    data: {
      "context": {
        "domain": "nic2004:85111",
        "country": "IND",
        "city": "std:080",
        "action": "init",
        "timestamp": new Date().toISOString(),
        "core_version": "0.7.1",
        "consumer_id": euaConsumerId,
        "consumer_uri": euaConsumerUri,
        "provider_id": "http://100.65.158.41:8084/api/v1",
        "provider_uri": providerUri,
        "transaction_id": uuid(),
        "message_id": uuid()
      },
      "message": {
        "order": {
          "id": uuid(),
          "item": {
            "id": "1",
            "descriptor": {
              "name": "Consultation"
            },
            "fulfillment_id": request.slotId,
            "price": {
              "currency": "INR",
              "value": "1000"
            }
          },
          "billing": {
            "name": request.patient.name,
          },
          "fulfillment": {
            "id": request.slotId,
            "type": "Teleconsultation",
            "agent": {
              "id": request.hprId,
              "name": request.doctor.name,
              "gender": request.doctor.gender,
              "tags": {
                "@abdm/gov/in/hpr_id": request.hprId
              }
            },
            "start": {
              "time": {
                "timestamp": request.startTime
              }
            },
            "end": {
              "time": {
                "timestamp": request.endTime
              }
            },
            "tags": {
              "@abdm/gov.in/slot_id": request.slotId
            }
          },
          "customer": {
            "id": request.patient.abhaAddress,
            "cred": request.patient.abhaAddress,
            "person": {
              "gender": request.patient.gender
            }
          }
        }
      }
    }
  })
}