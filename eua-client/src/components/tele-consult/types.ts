export type MessagePayload = {
  senderId: string;
  receiverId: string[];
  timestamp: Date;
  content: {
    id: string;
    value: string;
  };
};

export type MessageResponse = {};

export interface VideoCallData {
  clientId?: string;
  receiverIds: string[];
}

export interface GroupVideoCallData {
  clientId?: string;
  primaryDoctorId?: string;
  secondaryDoctorId?: string;
}
