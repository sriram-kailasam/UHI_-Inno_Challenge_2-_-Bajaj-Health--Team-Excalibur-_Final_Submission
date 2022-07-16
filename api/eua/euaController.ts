import { Request, Response, Router } from "express";
import { listAppointmentsByAbhaId, saveAppointment } from "../appointments/appointmentsService";
import { SaveAppointmentRequest, saveAppointmentRequestSchema } from "../appointments/dto/saveAppointment.dto";
import { SendMessageRequest } from "../dto/sendMessage.dto";
import { sendMessage } from "../hspa/hspService.external";
import { validateRequest } from "../validateRequest";
import { getSlots, initAppointment, searchDoctors } from "./euaService.external";

export function euaController() {
  const router = Router();

  router.get('/searchDoctors', handleSearchDoctors);
  router.get('/getSlots', handleGetSlots)
  router.post('/sendMessage', handleSendMessage)
  router.get('/getAppointmentList', handleGetAppointmentListByAbhaAddress)
  router.post('/bookAppointment', validateRequest('body', saveAppointmentRequestSchema), handleBookAppointment)

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

async function handleGetSlots(req: Request, res: Response) {
  const request = req.query as { hprId: string }

  const slots = await getSlots(request.hprId)
  res.json({ slots })
}

async function handleBookAppointment(req: Request, res: Response) {
  const request = req.body as SaveAppointmentRequest;

  await saveAppointment(request)
  await initAppointment(request)

  res.json({ success: true })
}

async function handleGetAppointmentListByAbhaAddress(req: Request, res: Response) {
  const { abhaAddress } = req.query;

  const results = await listAppointmentsByAbhaId(abhaAddress as string)


  res.json({ results })
}