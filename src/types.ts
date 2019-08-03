import { Request } from 'express'

interface IExtendedRequest extends Request {
  session?: {
    userId: number
  }
}

export interface IAppContext {
  req: IExtendedRequest
}
