export interface ApptBookPayload {
  startTime: string
  endTime: string
  slotId: string
  primaryDoctor: {
    hprId: string
    name: string
    gender?: string
  }
  secondaryDoctor: {
    hprId: string
    name: string
  }
  patient: {
    name: string
    abhaAddress: string
  }
}

export interface ApptBookResponse {
  success: boolean
}
