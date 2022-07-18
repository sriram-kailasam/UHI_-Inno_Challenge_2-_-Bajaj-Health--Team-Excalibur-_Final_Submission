import { v4 as uuid } from 'uuid';
import message from './message';

const createAndSendAnswer = (connection: any, clientId: string, receiverIds: string[]) => {
    // Create Answer
    (connection.current as any).createAnswer().then(
      (answer: any) => {
        console.log("Sent The Answer.");

        // Set Answer for negotiation
        (connection.current as any).setLocalDescription(answer);

        // Send Answer to other peer
        message({
          senderId: clientId,
          receiverId: receiverIds,
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "ANSWER",
              data: answer,
            }),
          },
        });
      },
      (error: any) => {
        console.log("Error when creating an answer.");
        console.error(error);
      }
    );
  };

export default createAndSendAnswer;
