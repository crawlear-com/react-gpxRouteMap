import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { useTranslation } from "react-i18next"
import { iconRoute } from '../components/MapPointPicker/Icons'
import { GeoPoint } from '../components/MapPointPicker/MapPointPicker'

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

      const circle = L.circle([e.latlng.lat, e.latlng.lng], circleMarkerAttribs).addTo(map.current!)
      markers.current.push(circle)

      onMapClick(e.latlng)
    }

    function addPropsPoints() {
      let max: GeoPoint = { lat: -90, lon: -180 }
      let min: GeoPoint = { lat: 90, lon: 180 }

      if (points.length > 0) {
        points.forEach((point) => {
          markers.current.push(L.marker([point.lat, point.lon], { icon: iconRoute }).addTo(map.current!))
          max = getMax(point, max)
          min = getMin(point, min)
        })
      }

      points.length && map.current?.fitBounds([
        [min.lat-0.225, min.lon-0.225],
        [max.lat+0.225, max.lon+0.225]])
    }
}

function getMin(p1: GeoPoint, p2: GeoPoint) {
  if(p1.lat < p2.lat) {
    p2.lat = p1.lat
  }
  if (p1.lon < p2.lon) {
    p2.lon = p1.lon
  }
  return p2
}

function getMax(p1: GeoPoint, p2: GeoPoint) {
  if(p1.lat > p2.lat) {
    p2.lat = p1.lat 
  }
  if(p1.lon > p2.lon) {
    p2.lon = p1.lon
  }
  return p2
}

export default UseMapPointPicker
