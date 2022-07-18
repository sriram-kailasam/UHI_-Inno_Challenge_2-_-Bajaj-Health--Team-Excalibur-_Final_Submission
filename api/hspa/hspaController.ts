import { Request, Response, Router } from "express";
import { validateRequest } from "../validateRequest";
import { SendMessageRequest, sendMessageRequestSchema } from "../dto/sendMessage.dto";
import { sendMessage } from "./hspService.external";
import { bookGroupConsult, listAppointmentsByHprId } from "../appointments/appointmentsService";
import { BookGroupConsultRequest, bookGroupConsultRequestSchema } from "../appointments/dto/saveAppointment.dto";
import { fetchDoctor, getDoctorSlots } from "../doctors/doctorsService";
import { v4 as uuid } from "uuid"
import { GetGroupConsultSlotsRequest, getGroupConsultSlotsRequestSchema } from "./dto/getGroupConsultSlots.dto";
import { getSlots } from "../eua/euaService.external";
import { getMatchingSlotPairs } from "./getGroupConsultSlots";

export function hspaController() {
  const router = Router()

  router.post('/sendMessage', validateRequest('body', sendMessageRequestSchema), handleSendMessage);
  router.get('/getAppointmentList', handleGetAppointmentListByHprId)
  router.post('/bookGroupConsult', validateRequest('body', bookGroupConsultRequestSchema), handleBookGroupConsult)
  router.get('/groupConsultSlots', validateRequest('query', getGroupConsultSlotsRequestSchema), handleGetGroupConsultSlots)

  router.post('/login', handleLogin)

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
    hprId: appointment.hprId,
    name: appointment.doctor.name,
    isGroupConsult: appointment.isGroupConsult,
    groupConsult: appointment.groupConsult
  }))

  res.json({ results })
}

async function handleBookGroupConsult(req: Request, res: Response) {
  const request = req.body as BookGroupConsultRequest;

  await bookGroupConsult(request)

  res.json({ success: true })
}

async function handleLogin(req: Request, res: Response) {
  const { hpAddress } = req.body;

  const doctor = await fetchDoctor(hpAddress)

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" })
  }

  res.json({
    accessToken: uuid(),
    hpAddress: hpAddress,
    name: doctor.name
  })
}


async function handleGetGroupConsultSlots(req: Request, res: Response) {
  const { primaryHprId, secondaryHprId, appointmentStartTime } = req.query as GetGroupConsultSlotsRequest

  const [primaryDoctorSlots, secondaryDoctorSlots] = await Promise.all([getDoctorSlots(primaryHprId), getSlots(secondaryHprId)])

  const matchingSlots = getMatchingSlotPairs(primaryDoctorSlots, secondaryDoctorSlots, appointmentStartTime)

  res.json({ slots: matchingSlots })
}