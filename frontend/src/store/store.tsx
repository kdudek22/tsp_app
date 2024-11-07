import {create} from 'zustand'
import {Route, Waypoint} from "../interfaces/Interfaces.ts";

type StoreType = {
    waypointNumber: number

    waypoints: Waypoint[]
    addWaypoint: (waypoint: Waypoint) => void
    setWaypoints: (waypoints: Waypoint[]) => void

    displayedRoutes: Route[]
    addRouteToDisplayed: (route: Route) => void
    removeRouteFromDisplayed: (route: Route) => void
    setDisplayedRoutes: (routes: Route[]) => void

    waypointToVisitOrderNumberMapping: Map<string, number>
    setWaypointToVisitOrderNumberMapping: (mapping: Map<string, number>) => void
}

export const useAppStore = create<StoreType> ((set) => ({
    waypointNumber: 0,
    waypoints: [],
    displayedRoutes: [],
    waypointToVisitOrderNumberMapping: new Map(),

    addWaypoint: (waypoint) => {
        set((state) => ({
            waypoints: [...state.waypoints, { ...waypoint, orderNumber: state.waypointNumber }],
            waypointNumber: state.waypointNumber + 1
        }))
    },

    setWaypoints: (waypoints) => {
        set(() =>  ({waypoints: waypoints}))
    },

    setDisplayedRoutes: (routes) => {
        set((state) => ({displayedRoutes: routes}))
    },

    // This adds a route to displayed routes if it is not in them already, else it updates the displayed color
    addRouteToDisplayed: (route) => {
        set((state) => {
            return state.displayedRoutes.some(r => r.id === route.id) ?
                {displayedRoutes: state.displayedRoutes.map(r => r.id === route.id ? { ...r, color: route.color } : r)}
                :
                {displayedRoutes: [...state.displayedRoutes, route]}
        });
    },

    removeRouteFromDisplayed: (route) => {
        set((state) => ({displayedRoutes: state.displayedRoutes.filter((r) => r.id !== route.id)}))
    },

    setWaypointToVisitOrderNumberMapping: (mapping) => {
        set((state) => ({waypointToVisitOrderNumberMapping: mapping}))
    }
}))



