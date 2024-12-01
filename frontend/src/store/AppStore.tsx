import {create} from 'zustand'
import {Route, SolveFor, SolveTransportType, Waypoint} from "../interfaces/Interfaces.ts";
import {useSettingsStore} from "./SettingsStore.tsx";

type StoreType = {
    waypointNumber: number

    waypoints: Waypoint[]
    addWaypoint: (waypoint: Waypoint) => void
    setWaypoints: (waypoints: Waypoint[]) => void
    removeWaypoint: (waypointId: string) => void

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

    durationMatrix: [[number]]
    distanceMatrix: [[number]]
    setDurationMatrix: (newMatrix) => void,
    setDistanceMatrix: (newMatrix) => void,

    matrixHoveredGridElement: [number | null, number : null]
    setMatrixHoveredGridElement: (element: [number | null, number | null]) => void

    startSolving: boolean
    setStartSolving: (newState: boolean) => void

}


export const useAppStore = create<StoreType> ((set) => ({
    waypointNumber: 0,
    waypoints: [],
    displayedRoutes: [],
    waypointToVisitOrderNumberMapping: new Map(),
    selectedSolverName: null,
    showLinesBetweenWaypoints: true,
    linesBetweenPointsColor: "#FFF000",

    durationMatrix: [[]],
    distanceMatrix: [[]],

    matrixHoveredGridElement: [null, null],
    solveFor: SolveFor.duration,

    weightedSolveWeight: 50,

    returnToStartingPoint: false,
    solverTransportType: SolveTransportType.car,

    startSolving: false,

    setStartSolving: (newState) => {
        set((state) => ({startSolving: newState}))
    },

    removeWaypoint: (waypointId) => {
        set((state) => ({waypoints: checkAndUpdateWaypoints(state.waypoints.filter(w => w.id !== waypointId), useSettingsStore.getState().returnToStartingPoint)}))
    },

    // Add a waypoint, checking the current state of canAddWaypoint
    addWaypoint: (waypoint) => {
        set((state) => {
            const newWaypoints =  [...state.waypoints, { ...waypoint, orderNumber: state.waypointNumber}]

            const res = checkAndUpdateWaypoints(newWaypoints, useSettingsStore.getState().returnToStartingPoint)

            return state.canAddWaypoints ?
                {waypoints: [...res],
                    waypointNumber: state.waypointNumber + 1}
                :
                state
        });
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

    setDistanceMatrix: (newMatrix) => {
        set((state) => ({distanceMatrix: newMatrix}))
    },

    setDurationMatrix: (newMatrix) => {
        set((state) => ({durationMatrix: newMatrix}))
    },

    setMatrixHoveredGridElement: (element) => {
        set((state) => ({matrixHoveredGridElement: element}))
    },

}))

export const checkAndUpdateWaypoints = (waypoints: [Waypoint], returnToStart: boolean): [Waypoint] => {
    let copy = [...waypoints]

    // In case we delete the last element - just return the empty array
    if(!copy.length){
        return copy
    }

    // if we return to the start point, the first waypoint for now is always the one we start and return to
    const clearedWaypoints = copy.map(w => ({...w, isStart: false, isEnd: false}))

    if(returnToStart){
        clearedWaypoints[0].isStart = true
        clearedWaypoints[0].isEnd = true
        return clearedWaypoints
    }

    if(clearedWaypoints.length === 1){
        clearedWaypoints[0].isStart = true
        return clearedWaypoints
    }

    clearedWaypoints[0].isStart = true
    clearedWaypoints[clearedWaypoints.length - 1].isEnd = true

    return clearedWaypoints
}

