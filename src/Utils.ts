import { XMLParser } from 'fast-xml-parser'
import { GpxInfo } from './components';
import { RoutePoint } from './components';

export function parseGpxString(gpx: string) {
    let result
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            isArray: (tagName: string, jPath: string, isLeafNode: boolean, isAttribute: boolean) => (tagName === 'trkpt')
          });
          result = parser.parse(gpx)
    } catch(e) {
      result = { gpx: { wpt: [] } }
    }

    return result
}

export function getGpxInfo(leafletEventTarget: any): GpxInfo {
    return {
        distance: leafletEventTarget.get_distance(),
        time: leafletEventTarget.get_total_time(),
        movingTime: leafletEventTarget.get_total_time(),
        speed: leafletEventTarget.get_total_speed(),
        elevationMin: leafletEventTarget.get_elevation_min(),
        elevationMax: leafletEventTarget.get_elevation_max(),
    }
}

export function getRoutePoint(jObj: any): RoutePoint {
    let lat = 0, lon = 0

    if (jObj.gpx.trk && jObj.gpx.trk.trkseg && jObj.gpx.trk.trkseg.trkpt[0] || jObj.gpx.wpt) {
        lat = Number(jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lat'] : jObj.gpx.wpt[0]['@_lat'])
        lon = Number(jObj.gpx.trk ? jObj.gpx.trk.trkseg.trkpt[0]['@_lon'] : jObj.gpx.wpt[0]['@_lon'])
    }
    return {
        lat: lat,
        lon: lon,
      }
}