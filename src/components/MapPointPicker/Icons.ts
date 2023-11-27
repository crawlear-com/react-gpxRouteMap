import 'leaflet-gpx'
import * as L from 'leaflet'

export const iconMark = L.icon({
  iconUrl: '/marker-icon-end.png',
  iconSize: [19, 31],
  iconAnchor: [9, 0]
})

export const iconRoute = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [19, 31],
  iconAnchor: [10, 0],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [31, 31]
})

export const circleMarkerAttribs = {
  color: '#444',
  fillColor: '#447',
  fillOpacity: 0.2,
  radius: 25000
}