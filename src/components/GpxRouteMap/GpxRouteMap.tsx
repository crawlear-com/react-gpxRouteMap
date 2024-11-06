import * as React from 'react'
import UseGpxRouteMap from '../../hooks/UseGpxRouteMap'
import useRouteRecorder from '../../hooks/useRouteRecorder'
import { parseGpxString, getRoutePoint } from '../../Utils'
import Graphs from './Graphs'
import ErrorBox from '../ErrorBox'
import '../../i18n'

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
  const [gpxRecorded, onStartStopClick] = useRouteRecorder(onError, gpx)
  const [onFileLoaded, getElevationMapData, extraGpxInfo] = UseGpxRouteMap(onFileResolved, gpxRecorded)
  const [recordState, setRecordState] = React.useState(false)
  const [error, setError] = React.useState<number>(0)
  const data = getElevationMapData(gpxRecorded || '')

  function onError(error: number) {
    setError(error)
  }

  function onStartStopRecord(event: React.MouseEvent<HTMLButtonElement>) {
    setRecordState(!recordState)
    onStartStopClick(event)
    if(recordState && onRouteRecorded && gpxRecorded && gpxRecorded.length && (gpxRecorded.indexOf('<trkpt')>0 || gpxRecorded.indexOf('<wpt')>0)) {
      let jObj = parseGpxString(gpxRecorded)
      const routePoint = getRoutePoint(jObj)

      onRouteRecorded(gpxRecorded, routePoint)
    }
  }

  return <div className="mapContainer">
      <ErrorBox error={error} />
      { onFileResolved && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
      { onRouteRecorded && <button onClick={onStartStopRecord}>{recordState ? "Stop" : "Rec"}</button> }
      <div id="map" title='routeMap' className="map"></div>
      { data.length ? <Graphs data={data} /> : <></> }
      { extraGpxInfo }
      </div>
}

export default GpxRouteMap
