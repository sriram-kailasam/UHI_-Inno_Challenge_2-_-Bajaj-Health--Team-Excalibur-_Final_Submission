import axios from "axios"
import { waitForData } from "../util/waitForData"
import { v4 as uuid } from 'uuid'
import { SearchResult } from "./dto/searchResult.dto";
import { GatewayOnSearchRequest } from "../uhi/eua/dto/gatewayOnSearch.dto";
import { euaConsumerId, euaConsumerUri } from "../configuration";

export async function searchDoctors(name: string): Promise<SearchResult[]> {
  const transactionId = await sendSearchDoctorsRequest(name);
  const result = await waitForData<GatewayOnSearchRequest>(`gatewaySearch:${transactionId}`)


  const searchResults: SearchResult[] = result.message.catalog.fulfillments?.map(fulfillment => {
    return {
      hprId: fulfillment.agent.id,
      name: fulfillment.agent.name,
      education: fulfillment.agent.tags['@abdm/gov/in/education'],
      experience: Number(fulfillment.agent.tags["@abdm/gov/in/experience"]),
      fees: Number(fulfillment.agent.tags["@abdm/gov/in/first_consultation"]),
      gender: fulfillment.agent.gender,
      imageUri: fulfillment.agent.image,
      speciality: fulfillment.agent.tags["@abdm/gov/in/speciality"],
      languages: fulfillment.agent.tags["@abdm/gov/in/languages"]?.split(',')
    }
  }) || []

  return searchResults
}

async function sendSearchDoctorsRequest(name: string) {
  const transactionId = uuid()
  await axios({
    baseURL: process.env.GATEWAY_BASE_URL,
    url: 'search',
    method: 'post',
    data:
    {
      "context": {
        "domain": "nic2004:85111",
        "country": "IND",
        "city": "std:080",
        "action": "on_search",
        "timestamp": "2022-07-07T10:43:48.705082Z",
        "core_version": "0.7.1",
        "consumer_id": euaConsumerId,
        "consumer_uri": euaConsumerUri,
        "provider_id": "http://100.65.158.41:8084/api/v1",
        "provider_uri": "http://100.65.158.41:8084/api/v1",
        "transaction_id": transactionId
      },
      "message": {
        "intent": {
          "fulfillment": {
            "agent": {
              "name": name
            },
            "start": {
              "time": {
                "timestamp": "2022-06-22T15:41:36"
              }
            },
            "end": {
              "time": {
                "timestamp": "2022-06-22T23:59:59"
              }
            },
            "type": "PhysicalConsultation"
          }
        }
      }
    }



  })

  return transactionId
}