import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
    durationMatrix: [[number]],
}


function PythonSolver({onSolverClicked, selectedSolverName, durationMatrix}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        const response = await requestService.post("http://127.0.0.1:5000/solve", {matrix: durationMatrix})

        const data = await response.json()
        return data.solution
    }

    return (
        <Solver durationMatrix={durationMatrix} selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#6F6FFF"} name={"Python solver"} solveTSP={solveTSP}></Solver>
    );
}

export default PythonSolver;