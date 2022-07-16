export type SaveAppointmentRequest = {
  startTime: Date;
  endTime: Date;
  slotId: string;
  hprId: string;
  abhaAddress: string;
  isGroupConsult: boolean;


  patient: {
    name: string;
    age: string;
    abhaAddress: string,
    gender: string
  }
}