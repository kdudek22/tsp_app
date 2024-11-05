import BasicSolver from "./solvers/BasicSolver.tsx";
import PythonSolver from "./solvers/PythonSolver.tsx";
import {Route, Waypoint} from "../interfaces/Interfaces.ts";
import React, {useState} from "react";


type Props = {
    waypoints: Waypoint[],
    durationMatrix: [[number]],
    removeRouteFromDisplayedRoutes: (id: string) => void
    updateDisplayedRoutes: (route: Route) => void
    setWaypointMapping: (mapping: Map<string, number>) => void
}

const SolversList = ({waypoints, durationMatrix, removeRouteFromDisplayedRoutes, updateDisplayedRoutes, setWaypointMapping}: Props) => {

    const [selectedSolverName, setSelectedSolverName] = useState<string|null>(null)

    const updateSelectedSolver = (solverName: string, waypointMapping: Map<string, number>) => {
        setWaypointMapping(waypointMapping)
        setSelectedSolverName(solverName)
    }

    const solvers = [<BasicSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver} requestToRemoveFromDisplayedRoutes={removeRouteFromDisplayedRoutes} requestToAddToDisplayedRoutes={updateDisplayedRoutes} waypoints={waypoints} durationMatrix={durationMatrix}/>,
                               <PythonSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver} requestToRemoveFromDisplayedRoutes={removeRouteFromDisplayedRoutes} requestToAddToDisplayedRoutes={updateDisplayedRoutes} waypoints={waypoints} durationMatrix={durationMatrix}/>]

    return (
        <div className="border-black border-2 border-opacity-10 rounded m-3 flex flex-col divide-y divide-gray-400" style={{background: "rgba(255, 255, 255, 0.9)"}}>
            <h2 className="font-bold text-xl px-4 py-2">Solvers</h2>
            {solvers.map((Component, index) => (
                React.cloneElement(Component, {key: index})
            ))}
      </div>
    );
};

export default SolversList;