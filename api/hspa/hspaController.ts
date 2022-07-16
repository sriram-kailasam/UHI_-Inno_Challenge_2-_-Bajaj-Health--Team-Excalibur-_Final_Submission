import { Request, Response, Router } from "express";
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { validateRequest } from "../validateRequest";
import { SendMessageRequest, sendMessageRequestSchema } from "../dto/sendMessage.dto";
import { sendMessage } from "./hspService.external";
import { listAppointmentsByHprId } from "../appointments/appointmentsService";

export function hspaController() {
  const router = Router()

  router.post('/sendMessage', validateRequest('body', sendMessageRequestSchema), handleSendMessage);
  router.get('/getAppointmentList', handleGetAppointmentListByHprId)
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

async function handleGetAppointmentListByHprId(req: Request, res: Response) {
  const { hpAddress } = req.query

  const appointments = await listAppointmentsByHprId(hpAddress as string)

  const results = appointments.map(appointment => ({
    appointment: {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    },
    patient: {
      name: appointment.patient.name,
      abhaAddress: appointment.patient.abhaAddress,
      age: appointment.patient.age,
      gender: appointment.patient.gender,
    },
    isGroupConsult: appointment.isGroupConsult,
  }))


  res.json({ results })
}