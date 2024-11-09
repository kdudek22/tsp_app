import BasicSolver from "./solvers/BasicSolver.tsx";
import PythonSolver from "./solvers/PythonSolver.tsx";
import React, {useState} from "react";
import {useAppStore} from "../store/store.tsx";


type Props = {
    durationMatrix: [[number]],
    setWaypointMapping: (mapping: Map<string, number>) => void
}

const SolversList = ({durationMatrix, setWaypointMapping}: Props) => {
    const selectedSolverName = useAppStore((state) => state.selectedSolverName)
    const setSelectedSolverName = useAppStore((state) => state.setSelectedSolverName)

    const updateSelectedSolver = (solverName: string, waypointMapping: Map<string, number>) => {
        setWaypointMapping(waypointMapping)
        setSelectedSolverName(solverName)
    }

    const solvers = [<BasicSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver} durationMatrix={durationMatrix}/>,
                               <PythonSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver} durationMatrix={durationMatrix}/>]

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