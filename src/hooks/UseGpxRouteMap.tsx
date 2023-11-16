import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { XMLParser } from 'fast-xml-parser'
import { RoutePoint, GpxInfo } from '../components/GpxRouteMap/GpxRouteMap'

const gpxParserOptions = {
    async: true,
    marker_options: {
      wptIconUrls: { '': '/marker-icon.png' },
      startIconUrl: '/marker-icon.png',
      endIconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png'
    }
}

function UseGpxRouteMap(onFileResolved?: Function, gpx?: string) {
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
        let jObj = parseGpxString(fileContent),
          routePoint: RoutePoint = getRoutePoint(jObj)
        const onLoadedHandler = (e: L.LeafletEvent) => {
            const gpxInfo = getGpxInfo(e.target)
            generateInfoPopUp(routePoint, gpxInfo, map)
            map.fitBounds(e.target.getBounds())

            onFileResolved && onFileResolved(fileContent, routePoint)
        }
        const gpxL = new L.GPX(fileContent, gpxParserOptions).on('loaded', onLoadedHandler).addTo(map) 

      } catch(e) {
        onFileResolved && onFileResolved('', { 
          lat: 0,
          lon: 0
        })
      }
    }

    return [onFileLoaded]
}

function getRoutePoint(jObj: any): RoutePoint {
    return {
        lat: jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lat'] : jObj.gpx.wpt[0]['@_lat'],
        lon: jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lon'] : jObj.gpx.wpt[0]['@_lon'],
      }
}

function parseGpxString(gpx: string) {
    let result
    try {
        const parser = new XMLParser({
            ignoreAttributes: false 
          });
          result = parser.parse(gpx)
    } catch(e) { }
    return result
}

function getGpxInfo(leafletEventTarget: any): GpxInfo {
    return {
        distance: leafletEventTarget.get_distance(),
        time: leafletEventTarget.get_total_time(),
        movingTime: leafletEventTarget.get_total_time(),
        speed: leafletEventTarget.get_total_speed(),
        elevationMin: leafletEventTarget.get_elevation_min(),
        elevationMax: leafletEventTarget.get_elevation_max(),
    }
}

function generateInfoPopUp(routePoint: RoutePoint, gpxInfo: GpxInfo, map: L.Map) {
    var popup = L.popup()
        .setLatLng([routePoint.lat, routePoint.lon])
        .setContent(`Distance: ${(gpxInfo.distance/1000).toFixed(3)} m\
            <br /> Time: ${((gpxInfo.time/1000)/60).toFixed(3)} mins\
            <br /> Moving Time: ${((gpxInfo.movingTime/1000)/60).toFixed(3)} mins\
            <br /> Speed: ${(gpxInfo.speed).toFixed(3)} Km/h\
            <br /> Elevation min: ${(gpxInfo.elevationMin).toFixed(3)} m\
            <br /> Elevation max: ${(gpxInfo.elevationMax).toFixed(3)} m`)
        .openOn(map);
}

export default UseGpxRouteMap
