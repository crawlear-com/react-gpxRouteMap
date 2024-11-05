import * as React from 'react'
import UseGpxRouteMap from '../../hooks/UseGpxRouteMap'
import useRouteRecorder from '../../hooks/useRouteRecorder'
import Graphs from './Graphs'
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
  const [gpxRecorded, onStartStopClick] = useRouteRecorder(gpx)
  const [onFileLoaded, getElevationMapData, extraGpxInfo] = UseGpxRouteMap(onFileResolved, gpxRecorded)
  const [recordState, setRecordState] = React.useState(false)
  const data = getElevationMapData(gpxRecorded || '')

  function onStartStopRecord(event: React.MouseEvent<HTMLButtonElement>) {
    setRecordState(!recordState)
    onStartStopClick(event)
    if(!recordState) {
      onRouteRecorded && onRouteRecorded(gpxRecorded)
    }
  }

  return <div className="mapContainer">
      { onFileResolved && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
      { onRouteRecorded && <button onClick={onStartStopRecord}>{recordState ? "Stop" : "Rec"}</button> }
      <div id="map" title='routeMap' className="map"></div>
      { data.length ? <Graphs data={data} /> : <></> }
      { extraGpxInfo }
      </div>
}

export default GpxRouteMap
