import * as React from 'react'
import { useTranslation } from 'react-i18next'

export const NO_ERROR = 0
export const ERR_GEOLOCATION_NOT_AVAILABLE = -1
export const ERR_GEOLOCATION_NOT_RESOLVED = -2
export const ERR_WAKELOCK_NOT_AVAILABLE = -3

function getErrorLabel(error: number): string {
    let errorMessage = ''
    switch (error) {
      case ERR_GEOLOCATION_NOT_AVAILABLE:
        errorMessage = 'errorNotAvailable'
        break;
      case ERR_GEOLOCATION_NOT_RESOLVED:
        errorMessage = 'errorNotResolved'
        break;
      case ERR_WAKELOCK_NOT_AVAILABLE:
        errorMessage = 'errorNoWakeLock'
        break;
      default:
        errorMessage = 'errorNotResolved'
        break;
    }

    return errorMessage
  }

interface ErrorBoxProps {
    error: number
}

function ErrorBox({ error }: ErrorBoxProps) {
    const { t } = useTranslation('gpxRouteMap')

    return error < 0 ? <div role="alert" className="errorBox">{ t(getErrorLabel(error)) }</div> : <></>
}

export default ErrorBox