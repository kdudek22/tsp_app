import L from 'leaflet'

export interface ClickListenerProps {
    onClick: (latlng: L.LatLng) => void;
  }

export interface Waypoint{
    id: string
    latlang: L.LatLng
}

export interface Route {
    id: string
    color: string
    points: L.LatLng[]
}
