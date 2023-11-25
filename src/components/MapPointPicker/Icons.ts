import 'leaflet-gpx'
import * as L from 'leaflet'

export const iconMark = L.icon({
  iconUrl: '/marker-icon-end.png',
  iconSize: [19, 31],
  iconAnchor: [19, 31],
  popupAnchor: [-3, -76],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [31, 31],
  shadowAnchor: [31, 31]
})

export const iconRoute = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [19, 31],
  iconAnchor: [19, 31],
  popupAnchor: [-3, -76],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [31, 31],
  shadowAnchor: [31, 31]
})