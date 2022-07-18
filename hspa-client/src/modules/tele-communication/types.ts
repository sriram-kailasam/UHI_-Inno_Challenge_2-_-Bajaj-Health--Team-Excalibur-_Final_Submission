export type MessagePayload = {
  senderId: string;
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
}

export interface GroupVideoCallData {
  clientId: string;
  patientId: string;
  remoteDoctorId: string;
}