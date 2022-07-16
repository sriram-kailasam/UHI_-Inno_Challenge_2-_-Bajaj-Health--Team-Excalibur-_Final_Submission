export interface DoctorSearchPayload {
  name: string
}

export interface DoctorSearchListResponse {
  searchResults: DoctorSearchResponse[]
}

export interface DoctorSearchResponse {
  hprId: string
  name: string
  education: string
  experience: string
  fees: string
  gender: string
  speciality: string
  languages: string[]
}
