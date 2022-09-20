/* eslint-disable no-unused-vars */
import AppInfo from '../../models/appInfo.model'

declare global {
  namespace Express {
    interface Request {
      appInfo: AppInfo | undefined
      userId: string | undefined
    }
  }
}
