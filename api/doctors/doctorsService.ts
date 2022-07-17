import { getDbClient } from "../database";
import { Doctor } from "./dto/doctor.dto";

export async function searchDoctors(query: string): Promise<Doctor[]> {
  const client = await getDbClient()

  const doctors = client.db().collection('doctors').find<Doctor>({ $or: [{ hprId: { $regex: query } }, { name: { $regex: query } }] }).toArray()

  return doctors;
}