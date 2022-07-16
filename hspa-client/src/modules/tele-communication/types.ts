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