import L from 'leaflet'

export interface Waypoint{
    id: string
    latlang: L.LatLng
}

export interface Route {
    id: string
    color: string
    totalCost: number
    solution: number[]
    points: L.LatLng[]
}
