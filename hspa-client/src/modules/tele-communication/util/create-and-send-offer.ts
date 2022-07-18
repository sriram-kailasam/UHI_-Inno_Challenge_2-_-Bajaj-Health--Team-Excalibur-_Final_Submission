import log from "lib/log";
import { v4 as uuid } from "uuid";

const createAndSendOffer = (
  connection: any,
  sendMessage: any,
  { clientId, receiverIds }: { clientId: string; receiverIds: string[] }
) => {
  // Create Offer
  (connection.current).createOffer().then(
    (offer: any) => {
      log("Sent The Offer.");

      sendMessage({
        senderId: clientId,
        receiverId: receiverIds,
        timestamp: new Date(),
        content: {
          id: uuid(),
          value: JSON.stringify({
            type: "OFFER",
            data: offer,
          }),
        },
      });

      // Set Offer for negotiation
      (connection.current).setLocalDescription(offer);
    },
    (error: any) => {
      log("Error when creating an offer.");
      console.error(error);
    }
  );
};

export default createAndSendOffer;
