import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SolveFor, SolveTransportType } from "../interfaces/Interfaces.ts";
import { checkAndUpdateWaypoints } from "./AppStore.tsx";
import { useAppStore } from "./AppStore.tsx";

type StoreType = {
    showLinesBetweenWaypoints: boolean;
    setShowLinesBetweenWaypoints: (next: boolean) => void;
    linesBetweenPointsColor: string;
    setLinesBetweenPointsColor: (newColor: string) => void;

    solveFor: SolveFor;
    setSolveFor: (solveFor: SolveFor) => void;

    weightedSolveWeight: number;
    setWeightedSolverWeight: (weight: number) => void;

    returnToStartingPoint: boolean;
    setReturnToStartingPoint: (newState: boolean) => void;

    solverTransportType: SolveTransportType;
    setSolverTransportType: (type: SolveTransportType) => void;
};

export const useSettingsStore = create<StoreType>()(
    persist(
        (set) => ({
            showLinesBetweenWaypoints: true,
            linesBetweenPointsColor: "#FFF000",

            setShowLinesBetweenWaypoints: (next) => {
                set(() => ({ showLinesBetweenWaypoints: next }));
            },

            setLinesBetweenPointsColor: (newColor) => {
                set(() => ({ linesBetweenPointsColor: newColor }));
            },

            solveFor: SolveFor.duration,
            setSolveFor: (solveFor) => {
                set(() => ({ solveFor }));
            },

            setReturnToStartingPoint: (newState) => {
                set(() => {
                    useAppStore.setState({... useAppStore.getState(),
                        waypoints: checkAndUpdateWaypoints(
                            useAppStore.getState().waypoints,
                            newState
                        ),
                    });
                    return { returnToStartingPoint: newState };
                });
            },

            setSolverTransportType: (newType) => {
                set(() => ({ solverTransportType: newType }));
            },

            weightedSolveWeight: 50,
            setWeightedSolverWeight: (weight) => {
                set(() => ({ weightedSolveWeight: weight }));
            },

            returnToStartingPoint: false,
            solverTransportType: SolveTransportType.car,
        }),
        {
            name: "settings-store", // Key in localStorage
            partialize: (state) => ({
                // Specify fields to persist
                showLinesBetweenWaypoints: state.showLinesBetweenWaypoints,
                linesBetweenPointsColor: state.linesBetweenPointsColor,
                solveFor: state.solveFor,
                returnToStartingPoint: state.returnToStartingPoint,
                solverTransportType: state.solverTransportType,
                weightedSolveWeight: state.weightedSolveWeight,
            }),
        }
    )
);
