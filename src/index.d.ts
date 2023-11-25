import * as React from 'react';

interface GpxRouteMapProps {
    gpx?: string;
    onFileResolved?: Function;
}
interface RoutePoint {
    lat: number;
    lon: number;
}
interface GpxInfo {
    distance: number;
    time: number;
    movingTime: number;
    speed: number;
    elevationMin: number;
    elevationMax: number;
}
interface MapPointPickerProps {
    onMapClick: Function
    points: Array<any>
}
declare function GpxRouteMap({ gpx, onFileResolved }: GpxRouteMapProps): React.JSX.Element;

declare function MapPointPicker({ onMapClick, points }: MapPointPickerProps): React.JSX.Element;

export { type GpxInfo, GpxRouteMap, MapPointPicker, type RoutePoint };
