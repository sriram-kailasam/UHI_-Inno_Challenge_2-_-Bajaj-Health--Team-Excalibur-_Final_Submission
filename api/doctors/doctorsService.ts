import { getDbClient } from "../database";
import { Slot } from "../eua/dto/slot.dto";
import { Doctor } from "./dto/doctor.dto";

export async function searchDoctors(query: string): Promise<Doctor[]> {
  const client = await getDbClient()

  const doctors = await client.db().collection('doctors').find<Doctor>({ $or: [{ hprId: { $regex: query } }, { name: { $regex: query } }] }).toArray()

  return doctors;
}

export async function fetchDoctor(hprId: string): Promise<Doctor | null> {
  const client = await getDbClient()

  const doctor = await client.db().collection('doctors').findOne<Doctor>({ hprId })

  return doctor;
}

export async function getDoctorSlots(hprId: string): Promise<Slot[]> {
  const client = await getDbClient()
  const doctor = await client.db().collection('doctors').findOne<Doctor>({ hprId })


  return doctor?.slots || [];
}