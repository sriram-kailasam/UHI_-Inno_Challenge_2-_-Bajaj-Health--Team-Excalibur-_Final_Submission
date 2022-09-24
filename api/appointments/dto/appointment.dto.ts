export type Appointment = {
  id: string
  startTime: string;
  endTime: string;
  slotId: string;
  hprId: string;
  abhaId: string;

  isGroupConsult: boolean;
  groupConsult?: {
    name: string;
    hprId: string;
  }

  doctor: {
    name: string;
    gender?: string | null;
  },

  patient: {
    name: string;
    age?: string;
    abhaAddress: string,
    gender?: string
  }
}