import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import FileLoader from './FileLoader'
//By now the css is not included until solved
//import '../../css/Map.scss'

interface GpxRouteMapProps {
  gpx?: string
  onFileResolved: Function
}

function GpxRouteMap ({ gpx, onFileResolved }: GpxRouteMapProps): React.JSX.Element {
  let map: L.Map

  React.useEffect(() => {
    map = L.map('map').fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map)
  }, [])

  function onFileLoaded(fileContent: string) {
    const gpxL = new L.GPX(fileContent, {
      async: true,
      marker_options: {
        wptIconUrls: { '': '/marker-icon.png' },
        startIconUrl: '/marker-icon.png',
        endIconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png'
      }}).on('loaded', (e: L.LeafletEvent) => {
        map.fitBounds(e.target.getBounds())
        onFileResolved(fileContent)
      }).addTo(map)
  }

  if (gpx && gpx.length) {
    onFileLoaded(gpx)
  }

  return <div className="mapContainer">
      <div id="map" className="map"></div>
      { !gpx && <FileLoader onFileLoaded={onFileLoaded}></FileLoader> }
    </div>
}

export default GpxRouteMap
