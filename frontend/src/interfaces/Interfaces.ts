import L from 'leaflet'

export interface Waypoint{
    id: string
    latlang: L.LatLng
    orderNumber?: number
}

export interface Route {
    id: string
    color: string
    totalCost: number
    solution: number[]
    points: L.LatLng[]
}


export enum SolveFor{
    distance="distance", duration="duration", weighted="weighted"
}

export enum SolveTransportType{
    car="car", walking="walking"
}
