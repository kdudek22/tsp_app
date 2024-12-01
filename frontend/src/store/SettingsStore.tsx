import {create} from 'zustand'
import {SolveFor, SolveTransportType} from "../interfaces/Interfaces.ts";
import {checkAndUpdateWaypoints} from "./AppStore.tsx";
import {useAppStore} from "./AppStore.tsx";

type StoreType = {
    showLinesBetweenWaypoints: boolean
    setShowLinesBetweenWaypoints: (next: boolean) => void
    linesBetweenPointsColor: string
    setLinesBetweenPointsColor: (newColor: string) => void

    solveFor: SolveFor
    setSolveFor: (solveFor: SolveFor) => void

    weightedSolveWeight: number
    setWeightedSolverWeight: (weight: number) => void

    returnToStartingPoint: boolean
    setReturnToStartingPoint: (newState: boolean) => void

    solverTransportType: SolveTransportType
    setSolverTransportType: (type: SolveTransportType) => void
}

export const useSettingsStore = create<StoreType> ((set) => ({

    showLinesBetweenWaypoints: true,
    linesBetweenPointsColor: "#FFF000",

    setShowLinesBetweenWaypoints: (next) => {
        set((state) => ({showLinesBetweenWaypoints: next}))
    },

    setLinesBetweenPointsColor: (newColor) => {
        set((state) => ({linesBetweenPointsColor: newColor}))
    },

    solveFor: SolveFor.duration,
    setSolveFor: (solveFor) => {
        set((state) => ({solveFor: solveFor}))
    },

    setReturnToStartingPoint: (newState) => {
        set((state) => {
            useAppStore.setState({waypoints: checkAndUpdateWaypoints(useAppStore.getState().waypoints, newState)})
            return({returnToStartingPoint: newState})
        })
    },

    setSolverTransportType: (newType) => {
        set((state) => ({solverTransportType: newType}))
    },

    weightedSolveWeight: 50,
    setWeightedSolverWeight: (weight) => {
        set((state) => ({weightedSolveWeight: weight}))
    },

    returnToStartingPoint: false,
    solverTransportType: SolveTransportType.car,
}))