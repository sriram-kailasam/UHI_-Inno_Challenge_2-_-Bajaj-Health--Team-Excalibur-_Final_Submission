export interface HeaderProps extends React.HTMLProps<HTMLDivElement> {
  heading : string
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
    gender: string
    age: string
  }
  isGroupConsult: boolean
  groupConsult?: {
    name: string
  }
}

export interface AppointmentListPayload {
  hpAddress: string
}
