import * as React from 'react'
import UseMapPointPicker, { PopopPoint } from '../../hooks/UseMapPointPicker'

interface MapPointPickerProps {
    onMapClick: Function
    points: Array<PopopPoint>
}

export interface GeoPoint {
    lat: number,
    lon: number
}

function MapPointPicker({ onMapClick, points }: MapPointPickerProps):React.JSX.Element {
    UseMapPointPicker(onMapClick, points)

    return <div className="mapContainer">
        <div id="mappicker" title='mapPointPicker' className="map"></div>
    </div>

}

export default MapPointPicker