import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'

import 'leaflet/dist/leaflet.css'
//import '../../css/Map.scss'

function GpxRouteMap (): React.JSX.Element {

  React.useEffect(() => {
    const map: L.Map = L.map('map').fitWorld();
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map)

    const fileSelect = document.getElementById('fileSelect')
    const fileElem = document.getElementById('fileElem')

    fileSelect?.addEventListener('click', () => {
        fileElem?.click();
    }, false);

    fileElem?.addEventListener('change', (e: Event) => {
        const file = (e?.target as HTMLInputElement).files?.[0]
        const fr = new FileReader()

        fr.onload = () => {
          const fileContent = fr.result?.toString() || ''
          const gpxL = new L.GPX(fileContent, {
            async: true,
            marker_options: {
              wptIconUrls: { '': '/marker-icon.png' },
              startIconUrl: '/marker-icon.png',
              endIconUrl: '/marker-icon.png',
              shadowUrl: '/marker-shadow.png'
            }}).on('loaded', function(e) {
            map.fitBounds(e.target.getBounds())
          }).addTo(map)
        }
        file && fr.readAsText(file)
    })
  }, [])

  return <div className="mapContainer">
      <div id="map" className="map"></div>
      <input type="file"
        id="fileElem"
        multiple
        accept=".gpx"
        style={{
            display: 'none'
        }} />
        <button id="fileSelect" type="button">Select some files</button>
    </div>
}

export default GpxRouteMap
