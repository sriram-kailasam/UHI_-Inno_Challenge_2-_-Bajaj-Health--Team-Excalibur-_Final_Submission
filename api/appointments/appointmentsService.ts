import { getDbClient } from "../database";
import { BookGroupConsultRequest, SaveAppointmentRequest } from "./dto/saveAppointment.dto";
import { v4 as uuid } from "uuid"
import { Appointment } from "./dto/appointment.dto";

export async function saveAppointment(request: SaveAppointmentRequest) {
  const client = await getDbClient();

  await client.db().collection('appointments').insertOne({
    id: uuid(),
    ...request
  })
}

export async function bookGroupConsult(request: BookGroupConsultRequest) {
  const client = await getDbClient();

  await client.db().collection('appointments').insertOne({
    id: uuid(),
    startTime: new Date(request.startTime),
    endTime: new Date(request.endTime),
    slotId: request.slotId,
    hprId: request.primaryDoctor.hprId,
    abhaId: request.patient.abhaAddress,

    isGroupConsult: true,
    doctor: {
      name: request.primaryDoctor.name,
      gender: request.primaryDoctor.gender
    },

    groupConsult: {
      name: request.secondaryDoctor.name,
      hprId: request.secondaryDoctor.hprId
    },

    patient: {
      name: request.patient.name,
      abhaAddress: request.patient.abhaAddress,
    }
  })
}

export async function listAppointmentsByAbhaId(abhaAddress: string): Promise<Appointment[]> {
  const client = await getDbClient();

  const appointments = await client.db().collection('appointments').find<Appointment>({ "patient.abhaAddress": abhaAddress }).toArray();

  return appointments;
}


export async function listAppointmentsByHprId(hprId: string): Promise<Appointment[]> {
  const client = await getDbClient();

  const appointments = await client.db().collection('appointments').find<Appointment>({ $or: [{ hprId: hprId }, { "groupConsult.hprId": hprId }] }).toArray();

  return appointments;
} 