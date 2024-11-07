import {Route, Waypoint} from "../../interfaces/Interfaces.ts";
import Solver from "./Solver.tsx";

type Props = {
    durationMatrix: [[number]],
    waypoints: Waypoint[],
    requestToAddToDisplayedRoutes: (route: Route) => void
    requestToRemoveFromDisplayedRoutes: (id: string) => void
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}


function BasicSolver({durationMatrix, waypoints, requestToAddToDisplayedRoutes, onSolverClicked, selectedSolverName}: Props) {

    const solveTSP = ([[number]]): Promise<number[]> => {
        return Promise.resolve([...Array.from({length: durationMatrix.length}, (_, index) => index), 0])
    }

    return (
        <Solver selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#000000"} name={"Basic solver"} durationMatrix={durationMatrix} solveTSP={solveTSP} waypoints={waypoints}></Solver>
    );
}

export default BasicSolver;