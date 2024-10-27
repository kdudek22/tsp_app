import {Route, Waypoint} from "../../interfaces/Interfaces.ts";
import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";

type Props = {
    durationMatrix: [[number]],
    waypoints: Waypoint[],
    requestToAddToDisplayedRoutes: (route: Route) => void
    requestToRemoveFromDisplayedRoutes: (id: string) => void
}


function PythonSolver({durationMatrix, waypoints, requestToAddToDisplayedRoutes, requestToRemoveFromDisplayedRoutes}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        const response = await requestService.post("http://127.0.0.1:5000/solve", {matrix: durationMatrix})

        const data = await response.json()
        return data.solution
    }

    return (
        <Solver defaultColor={"#6F6FFF"} name={"Python solver"} durationMatrix={durationMatrix} solveTSP={solveTSP} waypoints={waypoints} requestToAddToDisplayedRoutes={requestToAddToDisplayedRoutes} requestToRemoveFromDisplayedRoutes={requestToRemoveFromDisplayedRoutes}></Solver>
    );
}

export default PythonSolver;