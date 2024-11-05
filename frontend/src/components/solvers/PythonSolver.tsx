import {Route, Waypoint} from "../../interfaces/Interfaces.ts";
import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";

type Props = {
    durationMatrix: [[number]],
    waypoints: Waypoint[],
    requestToAddToDisplayedRoutes: (route: Route) => void
    requestToRemoveFromDisplayedRoutes: (id: string) => void
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}


function PythonSolver({durationMatrix, waypoints, requestToAddToDisplayedRoutes, requestToRemoveFromDisplayedRoutes, onSolverClicked, selectedSolverName}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        const response = await requestService.post("http://127.0.0.1:5000/solve", {matrix: durationMatrix})

        const data = await response.json()
        return data.solution
    }

    return (
        <Solver selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#6F6FFF"} name={"Python solver"} durationMatrix={durationMatrix} solveTSP={solveTSP} waypoints={waypoints} requestToAddToDisplayedRoutes={requestToAddToDisplayedRoutes} requestToRemoveFromDisplayedRoutes={requestToRemoveFromDisplayedRoutes}></Solver>
    );
}

export default PythonSolver;