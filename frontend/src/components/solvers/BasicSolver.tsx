import {Route, Waypoint} from "../../interfaces/Interfaces.ts";
import Solver from "./Solver.tsx";

type Props = {
    durationMatrix: [[number]],
    waypoints: Waypoint[],
    requestToAddToDisplayedRoutes: (route: Route) => void
    requestToRemoveFromDisplayedRoutes: (id: string) => void
}


function BasicSolver({durationMatrix, waypoints, requestToAddToDisplayedRoutes, requestToRemoveFromDisplayedRoutes}: Props) {

    const solveTSP = ([[number]]): Promise<number[]> => {
        return Promise.resolve([...Array.from({length: durationMatrix.length}, (_, index) => index), 0])
    }

    return (
        <Solver defaultColor={"#000000"} name={"Basic solver"} durationMatrix={durationMatrix} solveTSP={solveTSP} waypoints={waypoints} requestToAddToDisplayedRoutes={requestToAddToDisplayedRoutes} requestToRemoveFromDisplayedRoutes={requestToRemoveFromDisplayedRoutes}></Solver>
    );
}

export default BasicSolver;