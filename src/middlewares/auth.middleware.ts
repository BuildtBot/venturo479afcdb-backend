import { Request, Response } from 'express'
export const getAuth = (req: Request, res: Response, next: any) => {
  req.userId = 'dummy-user-id'
  next()
}
