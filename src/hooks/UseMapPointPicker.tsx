import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { useTranslation } from "react-i18next"
import { iconRoute } from '../components/MapPointPicker/Icons'

function UseMapPointPicker(onMapClick: Function, points: Array<any>): Array<any> {
    const { t } = useTranslation()
    const markers = React.useRef<Array<L.Layer>>([])
    const map = React.useRef<L.Map | null>(null)

    function removePreviousMarkers() {
      markers.current.forEach((marker) => {
        marker.remove()
      })
    }

    function mapClick(e: L.LeafletMouseEvent) {
      removePreviousMarkers()
      markers.current = []

      const circle = L.circle([e.latlng.lat, e.latlng.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: 50000
      }).addTo(map.current!)
      markers.current.push(circle)

      onMapClick(e.latlng)
    }

    function addPropsPoints() {
      let max = { lat: -90, lon: -180 }
      let min = { lat: 90, lon: 180 }
     
      if (points.length >=1) {
        points.forEach((point) => {
          markers.current.push(L.marker([point.lat, point.lon], { icon: iconRoute }).addTo(map.current!))
          if(point.lat < min.lat) {
            min.lat = point.lat
          }
          if (point.lon < min.lon) {
            min.lon = point.lon
          }
          if(point.lat > max.lat) {
            max.lat = point.lat 
          }
          if(point.lon > max.lon) {
            max.lon = point.lon
          }
        })
      }

      points.length && map.current?.fitBounds([
        [min.lat-0.3, min.lon-0.3],
        [max.lat+0.3, max.lon+0.3]
      ])
    }

    React.useEffect(() => {
      const newMap = L.map('mappicker').fitBounds([
        [41.29, 1.70],
        [41.79, 2.30]
      ]);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(newMap)
      newMap.on('click', (e: L.LeafletMouseEvent) => {
        mapClick(e)
      })
      map.current = newMap
      return () => {
        newMap.remove()
      }
    }, [])

    React.useEffect(() => {
      addPropsPoints()
    }, [points])

    return []
}

export default UseMapPointPicker
