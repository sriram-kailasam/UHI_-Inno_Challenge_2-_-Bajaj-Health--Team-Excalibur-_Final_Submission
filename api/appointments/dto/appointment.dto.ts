export type Appointment = {
  id: string
  createdAt: Date;
  startTime: Date;
  endTime: Date;
  slotId: string;
  hprId: string;
  abhaId: string;

  isGroupConsult: boolean;
  groupConsult?: {
    name?: string | null;
    hprId: string;
  }

  doctor: {
    name?: string | null;
    gender?: string | null;
  },

  patient: {
    name: string;
    age?: string;
    abhaAddress: string,
    gender?: string
  }
}