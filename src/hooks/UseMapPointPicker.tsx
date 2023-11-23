import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { useTranslation } from "react-i18next"
import { iconRoute } from '../components/MapPointPicker/Icons'

const ARROUND_BARCELONA: L.LatLngBoundsExpression = [[41.29, 1.70], [41.79, 2.30]]
const circleMarkerAttribs = {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.2,
  radius: 25000
}

function UseMapPointPicker(onMapClick: Function, points: Array<any>): void {
    const { t } = useTranslation()
    const markers = React.useRef<Array<L.Layer>>([])
    const map = React.useRef<L.Map | null>(null)

    React.useEffect(() => {
      const newMap = L.map('mappicker').fitBounds(ARROUND_BARCELONA);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
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


    function removePreviousMarkers() {
      markers.current.forEach((marker) => {
        marker.remove()
      })
    }

    function mapClick(e: L.LeafletMouseEvent) {
      removePreviousMarkers()
      markers.current = []

      console.log("CIRCLKE!")
      const circle = L.circle([e.latlng.lat, e.latlng.lng], circleMarkerAttribs).addTo(map.current!)
      markers.current.push(circle)

      onMapClick(e.latlng)
    }

    function addPropsPoints() {
      let max = { lat: -90, lon: -180 }
      let min = { lat: 90, lon: 180 }

      if (points.length > 0) {
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
        [min.lat-0.225, min.lon-0.225],
        [max.lat+0.225, max.lon+0.225]])
    }
}

export default UseMapPointPicker
