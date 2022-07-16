import { Request, Response, Router } from "express";
import { searchDoctors } from "./euaService.external";

export function euaController() {
  const router = Router();

  router.get('/searchDoctors', handleSearchDoctors);

  return router;
}

async function handleSearchDoctors(req: Request, res: Response) {
  const request = req.query as { name: string }

  const searchResults = await searchDoctors(request.name);

  res.json({ searchResults })
}