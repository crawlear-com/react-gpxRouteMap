import * as React from 'react'
import 'leaflet-gpx'
import * as L from 'leaflet'
import { XMLParser } from 'fast-xml-parser'
import { RoutePoint, GpxInfo } from '../components/GpxRouteMap/GpxRouteMap'
import { useTranslation } from "react-i18next"

const gpxParserOptions = {
    async: true,
    marker_options: {
      wptIconUrls: { '': '/marker-icon.png' },
      startIconUrl: '/marker-icon.png',
      endIconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png'
    }
}

function UseGpxRouteMap(onFileResolved?: Function, gpx?: string): Array<any> {
    let map: L.Map
    const [extraGpxInfo, setExtraGpxInfo] = React.useState<React.JSX.Element>(<></>)
    const { t } = useTranslation()

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

    function getElevationMapData(gpx: string): Array<number> {
        const gpxObject = parseGpxString(gpx)
        let sections: Array<any>
        const data: Array<number> = []
    
        if (gpxObject && gpxObject.gpx) {
          if (gpxObject.gpx.trk) {
            sections = gpxObject.gpx.trk.trkseg.trkpt
          } else {
              sections = gpxObject.gpx.wpt
          }      
          sections.forEach(element => {
              data.push(element.ele)
          })
        }
        return data
    }

    function generateInfoPopUp(gpxInfo: GpxInfo): React.JSX.Element {
      return <div className="extraGpxInfoContainer rounded rounded3">
        <div>{`${t('distancia')}: ${(gpxInfo.distance/1000).toFixed(3)} m`}</div>
        <div>{`${t('tiempo')}: ${((gpxInfo.time/1000)/60).toFixed(3)} mins`}</div>
        <div>{`${t('tiempomovimiento')}: ${((gpxInfo.movingTime/1000)/60).toFixed(3)} mins`}</div>
        <div>{`${t('elevacionmin')}: ${(gpxInfo.elevationMin).toFixed(3)} m`}</div>
        <div>{`${t('elevacionmax')}: ${(gpxInfo.elevationMax).toFixed(3)} m`}</div>
        <div>{`${t('velocidad')}: ${(gpxInfo.speed).toFixed(3)} Km/h`}</div>
      </div>
    }

    function onFileLoaded(fileContents: string): void {
      try {
        let jObj = parseGpxString(fileContents)
        const onLoadedHandler = (e: L.LeafletEvent) => {
            const routePoint: RoutePoint = getRoutePoint(jObj)
            const gpxInfo = getGpxInfo(e.target)

            map.fitBounds(e.target.getBounds())
            setExtraGpxInfo(generateInfoPopUp(gpxInfo))
            onFileResolved && onFileResolved(fileContents, routePoint)
        }
        const gpxL = new L.GPX(fileContents, gpxParserOptions).on('loaded', onLoadedHandler).addTo(map) 

      } catch(e) {
        onFileResolved && onFileResolved('', { 
          lat: 0,
          lon: 0
        },<></>)
      }
    }

    return [onFileLoaded, getElevationMapData, extraGpxInfo]
}

function getRoutePoint(jObj: any): RoutePoint {
    return {
        lat: Number(jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lat'] : jObj.gpx.wpt[0]['@_lat']),
        lon: Number(jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lon'] : jObj.gpx.wpt[0]['@_lon']),
      }
}

function parseGpxString(gpx: string) {
    let result
    try {
        const parser = new XMLParser({
            ignoreAttributes: false 
          });
          result = parser.parse(gpx)
    } catch(e) {
      result = { gpx: { wpt: [] } }
    }

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

export default UseGpxRouteMap
