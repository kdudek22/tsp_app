import Solver from "./Solver.tsx";

type Props = {
    durationMatrix: [[number]],
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}


function BasicSolver({durationMatrix, waypoints, onSolverClicked, selectedSolverName}: Props) {

    const solveTSP = (_: [[number]]): Promise<number[]> => {
        return Promise.resolve([...Array.from({length: durationMatrix.length}, (_, index) => index), 0])
    }

    return (
        <Solver selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#000000"} name={"Basic solver"} durationMatrix={durationMatrix} solveTSP={solveTSP} waypoints={waypoints}></Solver>
    );
}

export default BasicSolver;