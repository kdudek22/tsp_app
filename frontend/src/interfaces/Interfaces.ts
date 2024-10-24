import { LatLng } from 'leaflet';

export interface ClickListenerProps {
    onClick: (latlng: LatLng) => void;
  }

export interface Waypoint{
    id: number
    latlang: L.LatLng
}