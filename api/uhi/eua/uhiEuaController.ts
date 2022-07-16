import { Request, Response, Router } from "express";

export function uhiEuaController() {
  const router = Router()

  router.post('/on_message', handleOnMessage)

  return router;
}

async function handleOnMessage(req: Request, res: Response) {
  res.json({ success: true })
}

async function handleOnSearch(req: Request, res: Response) {

}