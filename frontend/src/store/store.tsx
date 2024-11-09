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

    canAddWaypoints: boolean
    setCanAddWaypoints: (canAdd: boolean) => void

    selectedSolverName: string | null
    setSelectedSolverName: (name: string) => void

    showLinesBetweenWaypoints: boolean
    setShowLinesBetweenWaypoints: (next: boolean) => void
    linesBetweenPointsColor: string
    setLinesBetweenPointsColor: (newColor: string) => void

    solveForMinimumDistance: boolean
    setSolveForMinimumDistance: (setVal: boolean) => void

    solveForMinimumTime: boolean
    setSolveForMinimumTime: (setVal: boolean) => void


}


export const useAppStore = create<StoreType> ((set) => ({
    waypointNumber: 0,
    waypoints: [],
    displayedRoutes: [],
    waypointToVisitOrderNumberMapping: new Map(),
    selectedSolverName: null,
    showLinesBetweenWaypoints: true,
    linesBetweenPointsColor: "#000000",

    solveForMinimumTime: true,
    solveForMinimumDistance: false,

    // Add a waypoint, checking the current state of canAddWaypoint
    addWaypoint: (waypoint) => {
        set((state) => {
            return state.canAddWaypoints ?
                {waypoints: [...state.waypoints, { ...waypoint, orderNumber: state.waypointNumber }],
                    waypointNumber: state.waypointNumber + 1}
                :
                state
        });
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
    },

    canAddWaypoints: true,

    setCanAddWaypoints: (canAdd) => {
        set((state) => ({canAddWaypoints: canAdd}))
    },

    setSelectedSolverName: (name) => {
        set((state) => ({selectedSolverName: name}))
    },

    setShowLinesBetweenWaypoints: (next) => {
        set((state) => ({showLinesBetweenWaypoints: next}))
    },

    setLinesBetweenPointsColor: (newColor) => {
        set((state) => ({linesBetweenPointsColor: newColor}))
    },


setSolveForMinimumDistance: (setVal) => {
    set(() => ({
        solveForMinimumDistance: setVal,
        solveForMinimumTime: !setVal, // Ensure only one can be true
    }));
},

setSolveForMinimumTime: (setVal) => {
    set(() => ({
        solveForMinimumTime: setVal,
        solveForMinimumDistance: !setVal, // Ensure only one can be true
    }));
},


}))


