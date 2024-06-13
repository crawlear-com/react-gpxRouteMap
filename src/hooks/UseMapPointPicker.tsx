import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { iconRoute, circleMarkerAttribs } from '../components/MapPointPicker/Icons'
import { GeoPoint } from '../components/MapPointPicker/MapPointPicker'

export interface PopopPoint {
  point: GeoPoint,
  content: HTMLElement
}

const ARROUND_BARCELONA: L.LatLngBoundsExpression = [[41.29, 1.70], [41.79, 2.30]]


function UseMapPointPicker(onMapClick: Function, points: Array<PopopPoint>): void {
    const markers = React.useRef<Array<L.Layer>>([])
    const map = React.useRef<L.Map | null>(null)

    React.useEffect(() => {
      const newMap = L.map('mappicker').fitBounds(ARROUND_BARCELONA)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
      }).addTo(newMap)
      newMap.on('click', (e: L.LeafletMouseEvent) => {
        mapClick(e)
      })
      map.current = newMap
      
      return () => {
        newMap.off()
        newMap.remove()
      }
    }, [])

    React.useEffect(() => {
      addPropsPoints()
    }, [points])


    function removePreviousMarkers(removeCircle: boolean) {
      markers.current.forEach((marker, index) => {
        if(index === 0 && removeCircle || index > 0) {
          marker.remove()
        }
      })
    }

    function mapClick(e: L.LeafletMouseEvent) {
      const bounds: L.LatLngBounds | undefined = map.current?.getBounds()
      const latGrad = (bounds?.getNorthEast().lat! - bounds?.getSouthWest().lat!)
      removePreviousMarkers(true)
      markers.current = []
      circleMarkerAttribs.radius = latGrad * 50332.5
     
      const circle = L.circle([e.latlng.lat, e.latlng.lng], circleMarkerAttribs).addTo(map.current!)
      markers.current.push(circle)

      onMapClick(e.latlng, map.current?.getBounds())
    }

    function addPropsPoints() {
      let max: GeoPoint = { lat: -90, lon: -180 }
      let min: GeoPoint = { lat: 90, lon: 180 }

      removePreviousMarkers(false)
      if (points.length > 0) {
        points.forEach((poppoint) => {
          markers.current.push(L.marker([poppoint.point.lat, poppoint.point.lon], 
            { icon: iconRoute }).bindPopup(poppoint.content).openPopup().addTo(map.current!))
          max = getMax(poppoint.point, max)
          min = getMin(poppoint.point, min)
        })
      }
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
