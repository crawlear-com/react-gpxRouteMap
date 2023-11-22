import * as React from 'react'
import UseMapPointPicker from '../../hooks/UseMapPointPicker'

interface MapPointPickerProps {
    onMapClick: Function
    points: Array<any>
}

function MapPointPicker({ onMapClick, points }: MapPointPickerProps):React.JSX.Element {
    const [res] = UseMapPointPicker(onMapClick, points)

    return <div className="mapContainer">
        <div id="mappicker" title='mapPointPicker' className="map"></div>
    </div>

}

export default MapPointPicker