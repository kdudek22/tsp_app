import BasicSolver from "./solvers/BasicSolver.tsx";
import PythonSolver from "./solvers/PythonSolver.tsx";
import React from "react";
import {useAppStore} from "../store/AppStore.tsx";
import MiniZincSolver from "./solvers/MiniZincSolver.tsx";
import BruteForceSolver from "./solvers/BruteForceSolver.tsx";
import GeneticSolver from "./solvers/GeneticSolver.tsx";


type Props = {
    setWaypointMapping: (mapping: Map<string, number>) => void
}

const SolversList = ({setWaypointMapping}: Props) => {
    const selectedSolverName = useAppStore((state) => state.selectedSolverName)
    const setSelectedSolverName = useAppStore((state) => state.setSelectedSolverName)
    const durationMatrix = useAppStore((state) => state.durationMatrix)

    const updateSelectedSolver = (solverName: string, waypointMapping: Map<string, number>) => {
        setWaypointMapping(waypointMapping)
        setSelectedSolverName(solverName)
    }

    const solvers = [<BasicSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver}/>,
                               <PythonSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver}/>,
                               <MiniZincSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver}/>,
                               <BruteForceSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver}/>,
                               <GeneticSolver selectedSolverName={selectedSolverName} isSelected={false} onSolverClicked={updateSelectedSolver}/>]

    return (
        <div className="border-gray-400 border-2 rounded m-3 flex flex-col divide-y divide-gray-400" style={{background: "rgba(255, 255, 255, 0.9)"}}>
            <h2 className="font-bold text-xl px-4 py-2">Solvers</h2>
            {solvers.map((Component, index) => (
                React.cloneElement(Component, {key: index})
            ))}
      </div>
    );
};

export default SolversList;