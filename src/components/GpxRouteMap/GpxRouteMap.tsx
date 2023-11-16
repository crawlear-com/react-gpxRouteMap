import * as React from 'react'
import UseGpxRouteMap from '../../hooks/UseGpxRouteMap'

import 'leaflet/dist/leaflet.css'
import FileLoader from './FileLoader'
//By now the css is not included until solved
//import '../../css/Map.scss'

interface GpxRouteMapProps {
  gpx?: string
  onFileResolved?: Function
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

function GpxRouteMap ({ gpx, onFileResolved }: GpxRouteMapProps): React.JSX.Element {
  const [onFileLoaded] = UseGpxRouteMap(onFileResolved, gpx)

  return <div className="mapContainer">
      { onFileResolved && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
      <div id="map" title='routeMap' className="map"></div>
    </div>
}

export default GpxRouteMap
