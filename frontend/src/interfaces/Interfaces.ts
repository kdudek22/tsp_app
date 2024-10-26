import { LatLng } from 'leaflet';

export interface ClickListenerProps {
    onClick: (latlng: LatLng) => void;
  }

export interface Waypoint{
    id: string
    latlang: LatLng
}

export interface Route {
    id: string
    color: string
    points: LatLng[]
}
