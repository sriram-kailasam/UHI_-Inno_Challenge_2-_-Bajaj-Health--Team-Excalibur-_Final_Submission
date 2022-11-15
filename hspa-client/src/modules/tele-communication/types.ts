export type MessagePayload = {
  senderId: string;
  appointmentId: string;
  receiverId: string[];
  timestamp: Date;
  content: {
    id: string;
    value: string;
  };
};

export type MessageResponse = {}

export interface VideoCallData {
  clientId: string;
  receiverIds: string[];
  isPrimaryDoctor: boolean;
  appointmentId: string;
}

export interface GroupVideoCallData {
  clientId: string;
  patientId: string;
  remoteDoctorId: string;
  appointmentId: string;
}