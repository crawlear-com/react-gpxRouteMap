import * as React from 'react'
import UseGpxRouteMap from '../../hooks/UseGpxRouteMap'
import useRouteRecorder from '../../hooks/useRouteRecorder'
import useWakeLock from '../../hooks/useWakeLock'
import RecButton from './RecButton'
import { parseGpxString, getRoutePoint } from '../../Utils'
import Graphs from './Graphs'
import ErrorBox, { NO_ERROR } from '../ErrorBox'
import { useTranslation, I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

import 'leaflet/dist/leaflet.css'
import FileLoader from './FileLoader'
import '../../css/Map.scss'

interface GpxRouteMapProps {
  gpx?: string
  onFileResolved?: Function
  onRouteRecorded?: Function
}

export interface RoutePoint {
  lat: number,
  lon: number
}

export interface GpxInfo {
  distance: number,
  time: number,
  movingTime: number,
  speed: number,
  elevationMin: number,
  elevationMax: number
}

function GpxRouteMap ({ gpx, onFileResolved, onRouteRecorded }: GpxRouteMapProps): React.JSX.Element {
  const [pollingTime, setPollingTime] = React.useState<number>(30)
  const [gpxRecorded, onStartStopClick] = useRouteRecorder(pollingTime, onError, gpx)
  const [requestWakeLock, releaseWakeLock] = useWakeLock(onError)
  const [onFileLoaded, getElevationMapData, extraGpxInfo, recordState, setRecordState, error, setError] = UseGpxRouteMap(onFileResolved, gpxRecorded)
  const { t } = useTranslation(['gpxRouteMap'])
  const data = getElevationMapData(gpxRecorded || '')

  function onError(error: number) {
    setError(error)
    if(recordState) {
      setRecordState(false)
    }
    releaseWakeLock()
  }

  function onStartStopRecord(event: React.MouseEvent<HTMLButtonElement>) {
    setError(NO_ERROR)
    setRecordState(!recordState)
    onStartStopClick(event)
    if(recordState && onRouteRecorded && gpxRecorded && gpxRecorded.length && (gpxRecorded.indexOf('<trkpt')>0 || gpxRecorded.indexOf('<wpt')>0)) {
      let jObj = parseGpxString(gpxRecorded)
      const routePoint = getRoutePoint(jObj)

      releaseWakeLock()
      onRouteRecorded(gpxRecorded, routePoint)
    } else if (!recordState) {
      requestWakeLock()
    }
  }

  function onPollingTimeChanged(value: number) {
    setPollingTime(value)
  }

  return <I18nextProvider i18n={i18n}>
      <div className="mapContainer">
        <ErrorBox error={error} />
        { onFileResolved && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
        { onRouteRecorded && <>
          <div>{t('recbutton')}</div>
          <RecButton onStartStopRecord={onStartStopRecord} recordState={recordState} onPollingTimeChange={onPollingTimeChanged} value={pollingTime} />
        </> }
        <div id="map" title='routeMap' className="map"></div>
        { data.length ? <Graphs data={data} /> : <></> }
        { extraGpxInfo }
      </div>
    </I18nextProvider>
}

export default GpxRouteMap
