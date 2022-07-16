import { getDbClient } from "../database";

export async function searchDoctorByHprId(hprId: string) {
  const client = await getDbClient()

  const doctors = client.db().collection('doctors').find({ hprId }).toArray()

  return doctors;
}