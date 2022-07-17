export interface HeaderProps extends React.HTMLProps<HTMLDivElement> {
  heading : string
  onBack: () => void
}
export interface AppointmentData {
  appointment : {
    id: string
    startTime: string
    endTime: string
  }
  patient: {
    name: string
    abhaAddress: string
    gender?: string
    age?: string
  }
  isGroupConsult: boolean
  groupConsult?: {
    name: string
    hprId?: string
  }
  hprId?: string
}

export interface AppointmentListPayload {
  hpAddress: string
}
