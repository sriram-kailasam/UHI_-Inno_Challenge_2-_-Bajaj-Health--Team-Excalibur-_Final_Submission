import { getDbClient } from "../database";
import { SaveAppointmentRequest } from "./dto/saveAppointment.dto";
import { v4 as uuid } from "uuid"
import { Appointment } from "./dto/appointment.dto";

export async function saveAppointment(request: SaveAppointmentRequest) {
  const client = await getDbClient();

  await client.db().collection('appointments').insertOne({
    id: uuid(),
    ...request
  })
}

export async function listAppointmentsByAbhaId(abhaId: string): Promise<Appointment[]> {
  const client = await getDbClient();

  const appointments = await client.db().collection('appointments').find<Appointment>({ abhaId }).toArray();

  return appointments;
}


export async function listAppointmentsByHprId(hprId: string): Promise<Appointment[]> {
  const client = await getDbClient();

  const appointments = await client.db().collection('appointments').find<Appointment>({ hprId }).toArray();

  return appointments;
} 