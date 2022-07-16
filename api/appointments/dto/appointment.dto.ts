export type Appointment = {
  id: string
  startTime: Date;
  endTime: Date;
  slotId: string;
  hprId: string;
  abhaId: string;
  isGroupConsult: boolean;

  patient: {
    name: string;
    age: string;
    abhaAddress: string,
    gender: string
  }
}