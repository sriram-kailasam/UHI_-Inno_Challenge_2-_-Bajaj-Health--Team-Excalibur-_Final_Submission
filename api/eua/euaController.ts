import { Request, Response, Router } from "express";
import { SendMessageRequest } from "../dto/sendMessage.dto";
import { sendMessage } from "../hspa/hspService.external";
import { searchDoctors } from "./euaService.external";

export function euaController() {
  const router = Router();

  router.get('/searchDoctors', handleSearchDoctors);
  router.post('/sendMessage', handleSendMessage)

  return router;
}

async function handleSendMessage(req: Request, res: Response) {
  const payload = req.body as SendMessageRequest;

  console.log('sendMessage called', payload)
  try { await sendMessage(payload) } catch (err) {
    console.log(err)
    console.log('response', (err as any)?.response?.data)
  }

  res.json({ success: true })
}

async function handleSearchDoctors(req: Request, res: Response) {
  const request = req.query as { name: string }

  const searchResults = await searchDoctors(request.name);

  res.json({ searchResults })
}