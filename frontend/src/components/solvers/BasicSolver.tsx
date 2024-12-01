import Solver from "./Solver.tsx";
import {useAppStore} from "../../store/AppStore.tsx";
import {useSettingsStore} from "../../store/SettingsStore.tsx";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
    durationMatrix: [[number]],
}


function BasicSolver({waypoints, onSolverClicked, selectedSolverName, durationMatrix}: Props) {

    const solveTSP = (durationMatrix: [[number]]): Promise<number[]> => {
        const returnToStartingPoint = useSettingsStore.getState().returnToStartingPoint

        if(returnToStartingPoint) {
            return Promise.resolve([...Array.from({length: durationMatrix.length}, (_, index) => index), 0])
        }

        return Promise.resolve([...Array.from({length: durationMatrix.length}, (_, index) => index)])
    }

    return (
        <Solver durationMatrix={durationMatrix} selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#000000"} name={"Order solver"} solveTSP={solveTSP} waypoints={waypoints}></Solver>
    );
}

export default BasicSolver;