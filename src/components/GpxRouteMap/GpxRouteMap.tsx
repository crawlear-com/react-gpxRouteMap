import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { XMLParser } from 'fast-xml-parser'

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

function GpxRouteMap ({ gpx, onFileResolved }: GpxRouteMapProps): React.JSX.Element {
  let map: L.Map

  React.useEffect(() => {
    map = L.map('map').fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map)

    if (gpx && gpx.length) {
      onFileLoaded(gpx)
    }
  }, [])

  function onFileLoaded(fileContent: string) {
    try {
      const parser = new XMLParser({
        ignoreAttributes: false 
      });
      let jObj = parser.parse(fileContent),
        routePoint: RoutePoint
  
      routePoint = {
        lat: jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lat'] : jObj.gpx.wpt[0]['@_lat'],
        lon: jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lon'] : jObj.gpx.wpt[0]['@_lon'],
      }

      const gpxL = new L.GPX(fileContent, {
        async: true,
        marker_options: {
          wptIconUrls: { '': '/marker-icon.png' },
          startIconUrl: '/marker-icon.png',
          endIconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png'
        }}).on('loaded', (e: L.LeafletEvent) => {
          map.fitBounds(e.target.getBounds())
          onFileResolved && onFileResolved(fileContent, routePoint)
        }).addTo(map) 
    } catch(e) {
      onFileResolved && onFileResolved('', { 
        lat: 0,
        lon: 0
      })
    }
  }

  return <div className="mapContainer">
      { onFileResolved && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
      <div id="map" className="map"></div>
    </div>
}

export default GpxRouteMap
